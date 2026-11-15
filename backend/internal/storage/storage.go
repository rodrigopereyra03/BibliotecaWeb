package storage

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var (
	minioClient *minio.Client
	bucketName  = "biblioteca"
	endpointURL = ""
)

// InitStorage initializes connection to Neon Object Storage
func InitStorage() error {
	rawEndpoint := os.Getenv("AWS_ENDPOINT_URL_S3")
	if rawEndpoint == "" {
		rawEndpoint = os.Getenv("NEON_STORAGE_ENDPOINT")
	}

	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	if accessKey == "" {
		accessKey = os.Getenv("NEON_STORAGE_ACCESS_KEY")
	}

	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	if secretKey == "" {
		secretKey = os.Getenv("NEON_STORAGE_SECRET_KEY")
	}

	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = os.Getenv("NEON_STORAGE_REGION")
	}
	if region == "" {
		region = "us-east-2"
	}

	if b := os.Getenv("NEON_STORAGE_BUCKET"); b != "" {
		bucketName = b
	}

	if rawEndpoint == "" || accessKey == "" || secretKey == "" {
		fmt.Println("Neon Object Storage no configurado, usando almacenamiento local en /uploads")
		return nil
	}

	endpointURL = rawEndpoint
	parsed, err := url.Parse(rawEndpoint)
	endpoint := rawEndpoint
	useSSL := true
	if err == nil && parsed.Host != "" {
		endpoint = parsed.Host
		if parsed.Scheme == "http" {
			useSSL = false
		}
	}

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
		Region: region,
	})
	if err != nil {
		return fmt.Errorf("error al inicializar cliente S3: %w", err)
	}

	minioClient = client
	fmt.Printf("Conectado a Neon Object Storage (Bucket: %s, Endpoint: %s)\n", bucketName, endpoint)
	return nil
}

// UploadFile uploads a multipart file to Neon S3 bucket 'biblioteca' or local fallback
func UploadFile(fileHeader *multipart.FileHeader, folder string) (string, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("error abriendo archivo: %w", err)
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if ext == "" {
		ext = ".bin"
	}

	uniqueName := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), uuid.New().String()[:8], ext)
	if folder != "" {
		uniqueName = folder + "/" + uniqueName
	}

	contentType := fileHeader.Header.Get("Content-Type")
	if contentType == "" {
		if ext == ".pdf" {
			contentType = "application/pdf"
		} else if ext == ".png" {
			contentType = "image/png"
		} else if ext == ".jpg" || ext == ".jpeg" {
			contentType = "image/jpeg"
		} else if ext == ".webp" {
			contentType = "image/webp"
		} else {
			contentType = "application/octet-stream"
		}
	}

	// 1. If Neon S3 client is initialized, attempt upload to Neon Object Storage
	if minioClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
		defer cancel()

		_, err = minioClient.PutObject(ctx, bucketName, uniqueName, file, fileHeader.Size, minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			log.Printf("Aviso: No se pudo subir a Neon S3 (%v). Usando almacenamiento local...\n", err)
		}
		if seeker, ok := file.(io.Seeker); ok {
			_, _ = seeker.Seek(0, io.SeekStart)
		}
	}

	// 2. Always maintain a local copy in uploads/ as fast cache & resilient backup
	uploadDir := filepath.Join(".", "uploads", folder)
	if err := os.MkdirAll(uploadDir, 0755); err == nil {
		localPath := filepath.Join(uploadDir, filepath.Base(uniqueName))
		if dest, err := os.Create(localPath); err == nil {
			defer dest.Close()
			_, _ = io.Copy(dest, file)
		}
	}

	// Return relative authenticated streaming path to avoid S3 403 Forbidden in browsers
	return fmt.Sprintf("/api/storage/%s", uniqueName), nil
}

// GetObject retrieves and streams an object from Neon S3 or local fallback
func GetObject(objectPath string) (io.ReadCloser, string, int64, error) {
	cleanPath := strings.TrimPrefix(objectPath, "/")
	cleanPath = strings.TrimPrefix(cleanPath, "api/storage/")
	cleanPath = strings.TrimPrefix(cleanPath, "biblioteca/")

	// 1. Try streaming from Neon S3 using authenticated credentials
	if minioClient != nil {
		obj, err := minioClient.GetObject(context.Background(), bucketName, cleanPath, minio.GetObjectOptions{})
		if err == nil {
			stat, statErr := obj.Stat()
			if statErr == nil && stat.Size > 0 {
				return obj, stat.ContentType, stat.Size, nil
			}
			obj.Close()
		}
	}

	// 2. Fallback to local uploads/
	localPath := filepath.Join(".", "uploads", filepath.Clean(cleanPath))
	f, err := os.Open(localPath)
	if err != nil {
		return nil, "", 0, err
	}
	stat, err := f.Stat()
	if err != nil {
		f.Close()
		return nil, "", 0, err
	}

	ext := strings.ToLower(filepath.Ext(cleanPath))
	mimeType := "application/octet-stream"
	if ext == ".jpg" || ext == ".jpeg" {
		mimeType = "image/jpeg"
	} else if ext == ".png" {
		mimeType = "image/png"
	} else if ext == ".webp" {
		mimeType = "image/webp"
	} else if ext == ".svg" {
		mimeType = "image/svg+xml"
	} else if ext == ".pdf" {
		mimeType = "application/pdf"
	}

	return f, mimeType, stat.Size(), nil
}
