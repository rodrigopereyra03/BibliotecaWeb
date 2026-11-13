package storage

import (
	"context"
	"fmt"
	"io"
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
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "us-east-2"
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

	// 1. If Neon S3 client is initialized, upload to Neon Object Storage
	if minioClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		_, err = minioClient.PutObject(ctx, bucketName, uniqueName, file, fileHeader.Size, minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			return "", fmt.Errorf("error subiendo a Neon Object Storage: %w", err)
		}

		// Public URL for Neon bucket
		publicURL := fmt.Sprintf("%s/%s/%s", strings.TrimRight(endpointURL, "/"), bucketName, uniqueName)
		return publicURL, nil
	}

	// 2. Local fallback: Save to uploads/
	uploadDir := filepath.Join(".", "uploads", folder)
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", fmt.Errorf("error creando directorio local: %w", err)
	}

	localPath := filepath.Join(uploadDir, filepath.Base(uniqueName))
	dest, err := os.Create(localPath)
	if err != nil {
		return "", fmt.Errorf("error creando archivo local: %w", err)
	}
	defer dest.Close()

	if _, err := io.Copy(dest, file); err != nil {
		return "", fmt.Errorf("error guardando archivo local: %w", err)
	}

	return fmt.Sprintf("/uploads/%s/%s", folder, filepath.Base(uniqueName)), nil
}
