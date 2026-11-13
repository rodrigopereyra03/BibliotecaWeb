package models

import "time"

type Book struct {
	ID              int64   `json:"id"`
	Title           string  `json:"title"`
	Author          string  `json:"author"`
	Genre           string  `json:"genre"`
	ISBN            string  `json:"isbn"`
	CoverURL        string  `json:"cover_url"`
	Synopsis        string  `json:"synopsis"`
	Location        string  `json:"location"`
	Format          string  `json:"format"` // "physical", "digital", "both"
	HasDigital      bool    `json:"has_digital"`
	DigitalURL      string  `json:"digital_url"`
	TotalCopies     int     `json:"total_copies"`
	AvailableCopies int     `json:"available_copies"`
	Rating          float64 `json:"rating"`
	ReviewsCount    int     `json:"reviews_count"`
	Featured        bool    `json:"featured"`
}

type User struct {
	UserID       int64     `json:"user_id"`
	ID           int64     `json:"id"` // alias for convenience
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	MemberNumber string    `json:"member_number"`
	Phone        string    `json:"phone,omitempty"`
	AvatarURL    string    `json:"avatar_url,omitempty"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
}

type Reservation struct {
	ID              int64      `json:"id"`
	UserID          int64      `json:"user_id"`
	BookID          int64      `json:"book_id"`
	Book            *Book      `json:"book,omitempty"`
	PickupSlot      string     `json:"pickup_slot"`
	PickupLocation  string     `json:"pickup_location"`
	Note            string     `json:"note"`
	ReservationCode string     `json:"reservation_code"`
	QRToken         string     `json:"qr_token"`
	Status          string     `json:"status"` // "ACTIVA", "RETIRADA", "CANCELADA"
	CreatedAt       time.Time  `json:"created_at"`
	ExpiresAt       time.Time  `json:"expires_at"`
}

type Loan struct {
	ID             int64      `json:"id"`
	UserID         int64      `json:"user_id"`
	BookID         int64      `json:"book_id"`
	Book           *Book      `json:"book,omitempty"`
	LoanDate       time.Time  `json:"loan_date"`
	DueDate        time.Time  `json:"due_date"`
	ReturnedDate   *time.Time `json:"returned_date,omitempty"`
	RenewalsCount  int        `json:"renewals_count"`
	Status         string     `json:"status"` // "EN_CURSO", "DEVUELTO", "VENCIDO"
}

type News struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Category  string    `json:"category"`
	Content   string    `json:"content"`
	ImageURL  string    `json:"image_url"`
	Published time.Time `json:"published"`
	Author    string    `json:"author"`
}
