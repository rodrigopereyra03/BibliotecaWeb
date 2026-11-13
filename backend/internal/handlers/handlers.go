package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"biblioteca-web/internal/database"
	"biblioteca-web/internal/models"
	"biblioteca-web/internal/storage"
)

// Helper para responder JSON
func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// GET /api/books
func GetBooks(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	genre := r.URL.Query().Get("genre")
	format := r.URL.Query().Get("format")

	baseQuery := `SELECT id, title, author, genre, isbn, cover_url, synopsis, location, format, has_digital, digital_url, total_copies, available_copies, rating, reviews_count, featured FROM books WHERE 1=1`
	var args []interface{}

	if query != "" {
		baseQuery += ` AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(synopsis) LIKE ?)`
		like := "%" + strings.ToLower(query) + "%"
		args = append(args, like, like, like)
	}

	if genre != "" && genre != "all" && genre != "Todas las Categorías" {
		baseQuery += ` AND LOWER(genre) LIKE ?`
		args = append(args, "%"+strings.ToLower(genre)+"%")
	}

	if format == "physical" {
		baseQuery += ` AND (format = 'physical' OR format = 'both')`
	} else if format == "digital" {
		baseQuery += ` AND (format = 'digital' OR format = 'both' OR has_digital = 1)`
	}

	baseQuery += ` ORDER BY featured DESC, rating DESC, id ASC`

	rows, err := database.Query(baseQuery, args...)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var b models.Book
		err := rows.Scan(&b.ID, &b.Title, &b.Author, &b.Genre, &b.ISBN, &b.CoverURL, &b.Synopsis, &b.Location, &b.Format, &b.HasDigital, &b.DigitalURL, &b.TotalCopies, &b.AvailableCopies, &b.Rating, &b.ReviewsCount, &b.Featured)
		if err != nil {
			continue
		}
		books = append(books, b)
	}

	if books == nil {
		books = []models.Book{}
	}

	jsonResponse(w, http.StatusOK, books)
}

// GET /api/books/:id
func GetBook(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/books/")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	var b models.Book
	err = database.QueryRow(`
		SELECT id, title, author, genre, isbn, cover_url, synopsis, location, format, has_digital, digital_url, total_copies, available_copies, rating, reviews_count, featured
		FROM books WHERE id = ?
	`, id).Scan(&b.ID, &b.Title, &b.Author, &b.Genre, &b.ISBN, &b.CoverURL, &b.Synopsis, &b.Location, &b.Format, &b.HasDigital, &b.DigitalURL, &b.TotalCopies, &b.AvailableCopies, &b.Rating, &b.ReviewsCount, &b.Featured)
	if err == sql.ErrNoRows {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Libro no encontrado"})
		return
	} else if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusOK, b)
}

// POST /api/books (Backoffice: Create Book)
func CreateBook(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title           string  `json:"title"`
		Author          string  `json:"author"`
		Genre           string  `json:"genre"`
		ISBN            string  `json:"isbn"`
		CoverURL        string  `json:"cover_url"`
		CoverImage      string  `json:"cover_image"`
		Synopsis        string  `json:"synopsis"`
		Description     string  `json:"description"`
		Location        string  `json:"location"`
		ShelfLocation   string  `json:"shelf_location"`
		Format          string  `json:"format"`
		HasDigital      bool    `json:"has_digital"`
		DigitalURL      string  `json:"digital_url"`
		Copies          int     `json:"copies"`
		TotalCopies     int     `json:"total_copies"`
		AvailableCopies int     `json:"available_copies"`
		Rating          float64 `json:"rating"`
		ReviewsCount    int     `json:"reviews_count"`
		Featured        bool    `json:"featured"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Datos inválidos"})
		return
	}

	if req.Title == "" || req.Author == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Título y autor son obligatorios"})
		return
	}

	coverURL := req.CoverURL
	if coverURL == "" {
		coverURL = req.CoverImage
	}
	if coverURL == "" {
		coverURL = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
	}

	synopsis := req.Synopsis
	if synopsis == "" {
		synopsis = req.Description
	}

	location := req.Location
	if location == "" {
		location = req.ShelfLocation
	}
	if location == "" {
		location = "Sector General · Estante 3B"
	}

	genre := req.Genre
	if genre == "" {
		genre = "Novelas & Ficción"
	}

	totalCopies := req.TotalCopies
	if totalCopies <= 0 {
		totalCopies = req.Copies
	}
	if totalCopies <= 0 {
		totalCopies = 1
	}

	availCopies := req.AvailableCopies
	if availCopies <= 0 {
		availCopies = totalCopies
	}

	rating := req.Rating
	if rating <= 0 {
		rating = 5.0
	}

	format := strings.ToLower(req.Format)
	if format == "físico" || format == "fisico" {
		format = "physical"
	} else if format == "digital (pdf)" || format == "digital" {
		format = "digital"
	} else if format == "ambos" || format == "both" {
		format = "both"
	}
	if format == "" {
		format = "physical"
	}

	hasDigital := req.HasDigital
	if req.DigitalURL != "" {
		hasDigital = true
		if format == "physical" {
			format = "both"
		}
	}

	newID, err := database.InsertWithReturnID(`
		INSERT INTO books (title, author, genre, isbn, cover_url, synopsis, location, format, has_digital, digital_url, total_copies, available_copies, rating, reviews_count, featured)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, req.Title, req.Author, genre, req.ISBN, coverURL, synopsis, location, format, hasDigital, req.DigitalURL, totalCopies, availCopies, rating, req.ReviewsCount, req.Featured)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	b := models.Book{
		ID:              newID,
		Title:           req.Title,
		Author:          req.Author,
		Genre:           genre,
		ISBN:            req.ISBN,
		CoverURL:        coverURL,
		Synopsis:        synopsis,
		Location:        location,
		Format:          format,
		HasDigital:      hasDigital,
		DigitalURL:      req.DigitalURL,
		TotalCopies:     totalCopies,
		AvailableCopies: availCopies,
		Rating:          rating,
		ReviewsCount:    req.ReviewsCount,
		Featured:        req.Featured,
	}

	jsonResponse(w, http.StatusCreated, b)
}

// DELETE /api/books/:id
func DeleteBook(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/books/")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	_, err = database.Exec("DELETE FROM books WHERE id = ?", id)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Libro eliminado"})
}

// POST /api/reservations
type CreateReservationRequest struct {
	UserID         int64  `json:"user_id"`
	BookID         int64  `json:"book_id"`
	PickupSlot     string `json:"pickup_slot"`
	PickupLocation string `json:"pickup_location"`
	Note           string `json:"note"`
}

func CreateReservation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "Método no permitido"})
		return
	}

	var req CreateReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Cuerpo de solicitud inválido"})
		return
	}

	if req.UserID == 0 {
		req.UserID = 1 // David Miller por defecto
	}
	if req.PickupLocation == "" {
		req.PickupLocation = "Sigmund Freud 201, Temperley"
	}
	if req.PickupSlot == "" {
		req.PickupSlot = "Turno Mañana (10:00 a 13:00 hs)"
	}

	// Verificar disponibilidad
	var available int
	err := database.QueryRow("SELECT available_copies FROM books WHERE id = ?", req.BookID).Scan(&available)
	if err == sql.ErrNoRows {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Libro no encontrado"})
		return
	}
	if available <= 0 {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "No hay ejemplares disponibles en este momento"})
		return
	}

	// Generar código y QR Token
	randomNum := 1000 + rand.Intn(9000)
	code := fmt.Sprintf("RES-LOURDES-%d", randomNum)
	qrToken := fmt.Sprintf("PASS-QR-%s-%d", code, time.Now().Unix())
	now := time.Now()
	expiresAt := now.Add(48 * time.Hour) // 48hs para retirar

	resID, err := database.InsertWithReturnID(`
		INSERT INTO reservations (user_id, book_id, pickup_slot, pickup_location, note, reservation_code, qr_token, status, created_at, expires_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVA', ?, ?)
	`, req.UserID, req.BookID, req.PickupSlot, req.PickupLocation, req.Note, code, qrToken, now, expiresAt)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	// Reducir copias disponibles
	database.Exec("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?", req.BookID)

	// Obtener datos del libro
	var book models.Book
	database.QueryRow(`
		SELECT id, title, author, genre, isbn, cover_url, synopsis, location, format, has_digital, total_copies, available_copies, rating, reviews_count, featured
		FROM books WHERE id = ?
	`, req.BookID).Scan(&book.ID, &book.Title, &book.Author, &book.Genre, &book.ISBN, &book.CoverURL, &book.Synopsis, &book.Location, &book.Format, &book.HasDigital, &book.TotalCopies, &book.AvailableCopies, &book.Rating, &book.ReviewsCount, &book.Featured)

	reservation := models.Reservation{
		ID:              resID,
		UserID:          req.UserID,
		BookID:          req.BookID,
		Book:            &book,
		PickupSlot:      req.PickupSlot,
		PickupLocation:  req.PickupLocation,
		Note:            req.Note,
		ReservationCode: code,
		QRToken:         qrToken,
		Status:          "ACTIVA",
		CreatedAt:       now,
		ExpiresAt:       expiresAt,
	}

	jsonResponse(w, http.StatusCreated, reservation)
}

// GET /api/reservations
func GetReservations(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Query(`
		SELECT r.id, r.user_id, r.book_id, r.pickup_slot, r.pickup_location, r.note, r.reservation_code, r.qr_token, r.status, r.created_at, r.expires_at,
		       b.title, b.author, b.genre, b.cover_url, b.location
		FROM reservations r
		JOIN books b ON r.book_id = b.id
		WHERE r.status = 'ACTIVA'
		ORDER BY r.id DESC
	`)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var reservations []models.Reservation
	for rows.Next() {
		var res models.Reservation
		var book models.Book
		err := rows.Scan(&res.ID, &res.UserID, &res.BookID, &res.PickupSlot, &res.PickupLocation, &res.Note, &res.ReservationCode, &res.QRToken, &res.Status, &res.CreatedAt, &res.ExpiresAt,
			&book.Title, &book.Author, &book.Genre, &book.CoverURL, &book.Location)
		if err != nil {
			continue
		}
		book.ID = res.BookID
		res.Book = &book
		reservations = append(reservations, res)
	}

	if reservations == nil {
		reservations = []models.Reservation{}
	}

	jsonResponse(w, http.StatusOK, reservations)
}

// POST /api/reservations/cancel
func CancelReservation(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ID int64 `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	var bookID int64
	err := database.QueryRow("SELECT book_id FROM reservations WHERE id = ?", body.ID).Scan(&bookID)
	if err != nil {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Reserva no encontrada"})
		return
	}

	_, err = database.Exec("UPDATE reservations SET status = 'CANCELADA' WHERE id = ?", body.ID)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	// Restaurar copia
	database.Exec("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?", bookID)

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Reserva cancelada con éxito"})
}

// POST /api/reservations/deliver (Backoffice: Entregar libro reservado al lector y crear préstamo activo)
func DeliverReservation(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ReservationCode string `json:"reservation_code"`
		ReservationID   int64  `json:"reservation_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Datos inválidos"})
		return
	}

	var resID, userID, bookID int64
	var status string
	var query string
	var arg interface{}

	if body.ReservationCode != "" {
		query = "SELECT id, user_id, book_id, status FROM reservations WHERE reservation_code = ?"
		arg = strings.TrimSpace(body.ReservationCode)
	} else {
		query = "SELECT id, user_id, book_id, status FROM reservations WHERE id = ?"
		arg = body.ReservationID
	}

	err := database.QueryRow(query, arg).Scan(&resID, &userID, &bookID, &status)
	if err != nil {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Pase de retiro no encontrado"})
		return
	}

	if status != "ACTIVA" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Esta reserva ya fue entregada o cancelada"})
		return
	}

	// Marcar reserva como entregada
	database.Exec("UPDATE reservations SET status = 'RETIRADA' WHERE id = ?", resID)

	// Crear préstamo activo por 21 días
	now := time.Now()
	dueDate := now.Add(21 * 24 * time.Hour)
	_, err = database.Exec(`
		INSERT INTO loans (user_id, book_id, loan_date, due_date, renewals_count, status)
		VALUES (?, ?, ?, ?, 0, 'EN_CURSO')
	`, userID, bookID, now, dueDate)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"message":  "¡Ejemplar entregado con éxito! Se ha registrado el préstamo por 21 días.",
		"due_date": dueDate,
	})
}

// GET /api/loans
func GetLoans(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Query(`
		SELECT l.id, l.user_id, l.book_id, l.loan_date, l.due_date, l.returned_date, l.renewals_count, l.status,
		       b.title, b.author, b.genre, b.cover_url, b.location
		FROM loans l
		JOIN books b ON l.book_id = b.id
		ORDER BY l.status ASC, l.due_date ASC
	`)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var loans []models.Loan
	for rows.Next() {
		var l models.Loan
		var book models.Book
		err := rows.Scan(&l.ID, &l.UserID, &l.BookID, &l.LoanDate, &l.DueDate, &l.ReturnedDate, &l.RenewalsCount, &l.Status,
			&book.Title, &book.Author, &book.Genre, &book.CoverURL, &book.Location)
		if err != nil {
			continue
		}
		book.ID = l.BookID
		l.Book = &book
		loans = append(loans, l)
	}

	if loans == nil {
		loans = []models.Loan{}
	}

	jsonResponse(w, http.StatusOK, loans)
}

// POST /api/loans/renew
func RenewLoan(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ID int64 `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	var dueDate time.Time
	var renewals int
	err := database.QueryRow("SELECT due_date, renewals_count FROM loans WHERE id = ?", body.ID).Scan(&dueDate, &renewals)
	if err != nil {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Préstamo no encontrado"})
		return
	}

	if renewals >= 3 {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Se alcanzó el máximo de renovaciones permitidas (3)"})
		return
	}

	newDueDate := dueDate.Add(21 * 24 * time.Hour)
	_, err = database.Exec("UPDATE loans SET due_date = ?, renewals_count = renewals_count + 1 WHERE id = ?", newDueDate, body.ID)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"message":        "Préstamo renovado por 21 días adicionales",
		"new_due_date":   newDueDate,
		"renewals_count": renewals + 1,
	})
}

// POST /api/loans/return (Backoffice: Registrar devolución de ejemplar)
func ReturnLoan(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ID int64 `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	var bookID int64
	var status string
	err := database.QueryRow("SELECT book_id, status FROM loans WHERE id = ?", body.ID).Scan(&bookID, &status)
	if err != nil {
		jsonResponse(w, http.StatusNotFound, map[string]string{"error": "Préstamo no encontrado"})
		return
	}

	if status == "DEVUELTO" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Este préstamo ya figura como devuelto"})
		return
	}

	now := time.Now()
	_, err = database.Exec("UPDATE loans SET status = 'DEVUELTO', returned_date = ? WHERE id = ?", now, body.ID)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	// Restaurar copia disponible en el catálogo
	database.Exec("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?", bookID)

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Devolución registrada con éxito"})
}

// GET /api/news
func GetNews(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Query("SELECT id, title, category, content, image_url, published, author FROM news ORDER BY published DESC")
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var news []models.News
	for rows.Next() {
		var n models.News
		err := rows.Scan(&n.ID, &n.Title, &n.Category, &n.Content, &n.ImageURL, &n.Published, &n.Author)
		if err != nil {
			continue
		}
		news = append(news, n)
	}

	if news == nil {
		news = []models.News{}
	}

	jsonResponse(w, http.StatusOK, news)
}

// POST /api/news (Backoffice: Publicar noticia)
func CreateNews(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title    string `json:"title"`
		Category string `json:"category"`
		Content  string `json:"content"`
		ImageURL string `json:"image_url"`
		Image    string `json:"image"`
		Author   string `json:"author"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Datos inválidos"})
		return
	}

	if req.Title == "" || req.Content == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Título y contenido son obligatorios"})
		return
	}
	if req.Category == "" {
		req.Category = "Comunidad"
	}
	if req.Author == "" {
		req.Author = "Secretaría Parroquial"
	}
	imageURL := req.ImageURL
	if imageURL == "" {
		imageURL = req.Image
	}
	if imageURL == "" {
		imageURL = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
	}

	newID, err := database.InsertWithReturnID(`
		INSERT INTO news (title, category, content, image_url, published, author)
		VALUES (?, ?, ?, ?, ?, ?)
	`, req.Title, req.Category, req.Content, imageURL, time.Now(), req.Author)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	n := models.News{
		ID:        newID,
		Title:     req.Title,
		Category:  req.Category,
		Content:   req.Content,
		ImageURL:  imageURL,
		Published: time.Now(),
		Author:    req.Author,
	}
	jsonResponse(w, http.StatusCreated, n)
}

// DELETE /api/news/:id
func DeleteNews(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/news/")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "ID inválido"})
		return
	}

	_, err = database.Exec("DELETE FROM news WHERE id = ?", id)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Noticia eliminada"})
}

// GET /api/users (Backoffice: Listar lectores/miembros)
func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := database.Query("SELECT user_id, name, email, member_number, phone, avatar_url, role FROM users ORDER BY user_id ASC")
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.UserID, &u.Name, &u.Email, &u.MemberNumber, &u.Phone, &u.AvatarURL, &u.Role)
		if err != nil {
			continue
		}
		u.ID = u.UserID
		users = append(users, u)
	}

	if users == nil {
		users = []models.User{}
	}

	jsonResponse(w, http.StatusOK, users)
}

// GET /api/user/me
func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	var u models.User
	err := database.QueryRow("SELECT user_id, name, email, member_number, phone, avatar_url, role FROM users LIMIT 1").Scan(
		&u.UserID, &u.Name, &u.Email, &u.MemberNumber, &u.Phone, &u.AvatarURL, &u.Role,
	)
	if err == sql.ErrNoRows {
		jsonResponse(w, http.StatusOK, nil)
		return
	} else if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	u.ID = u.UserID
	jsonResponse(w, http.StatusOK, u)
}

// POST /api/auth/register
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "Datos inválidos"})
		return
	}

	num := 4000 + rand.Intn(5000)
	memberNumber := fmt.Sprintf("GT-%d", num)
	avatar := "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"

	newID, err := database.InsertUserWithReturnID(`
		INSERT INTO users (name, email, member_number, phone, avatar_url, role)
		VALUES (?, ?, ?, ?, ?, 'lector')
	`, body.Name, body.Email, memberNumber, body.Phone, avatar)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": "No se pudo registrar: el correo ya puede estar registrado"})
		return
	}

	u := models.User{
		UserID:       newID,
		ID:           newID,
		Name:         body.Name,
		Email:        body.Email,
		MemberNumber: memberNumber,
		Phone:        body.Phone,
		AvatarURL:    avatar,
		Role:         "lector",
	}

	jsonResponse(w, http.StatusCreated, u)
}

// GET /api/stats (Backoffice: KPIs del Dashboard)
func GetStats(w http.ResponseWriter, r *http.Request) {
	var totalBooks, physicalBooks, digitalBooks, activeLoans, pendingPickups, totalMembers int

	database.QueryRow("SELECT COUNT(*) FROM books").Scan(&totalBooks)
	database.QueryRow("SELECT COUNT(*) FROM books WHERE format = 'physical' OR format = 'both'").Scan(&physicalBooks)
	database.QueryRow("SELECT COUNT(*) FROM books WHERE has_digital = TRUE OR format = 'digital' OR format = 'both'").Scan(&digitalBooks)
	database.QueryRow("SELECT COUNT(*) FROM loans WHERE status = 'EN_CURSO'").Scan(&activeLoans)
	database.QueryRow("SELECT COUNT(*) FROM reservations WHERE status = 'ACTIVA'").Scan(&pendingPickups)
	database.QueryRow("SELECT COUNT(*) FROM users").Scan(&totalMembers)

	stats := map[string]interface{}{
		"total_books":      totalBooks,
		"physical_books":   physicalBooks,
		"digital_books":    digitalBooks,
		"active_loans":     activeLoans,
		"pending_pickups":  pendingPickups,
		"total_members":    totalMembers,
		"on_time_rate":     "96%",
		"avg_loan_days":    21,
	}

	jsonResponse(w, http.StatusOK, stats)
}

// POST /api/upload
func UploadFile(w http.ResponseWriter, r *http.Request) {
	// Limitar subida a 60MB (soporta imágenes y PDFs completos)
	if err := r.ParseMultipartForm(60 << 20); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "El archivo es demasiado grande o el formulario no es válido"})
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "No se recibió ningún archivo"})
		return
	}
	file.Close()

	folder := r.FormValue("folder")
	if folder == "" {
		folder = "uploads"
	}

	url, err := storage.UploadFile(header, folder)
	if err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error al subir archivo: %v", err)})
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{
		"url":      url,
		"filename": header.Filename,
	})
}

// POST /api/admin/reset-db
func ResetDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	if err := database.ResetCleanDatabase(); err != nil {
		jsonResponse(w, http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("Error al resetear base de datos: %v", err)})
		return
	}
	jsonResponse(w, http.StatusOK, map[string]string{"message": "Base de datos reseteada con éxito a 0 registros"})
}
