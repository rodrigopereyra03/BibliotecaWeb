package database

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/lib/pq"
	_ "modernc.org/sqlite"
)

var (
	DB         *sql.DB
	DriverName string = "sqlite" // "sqlite" or "postgres"
)

// InitDB initializes local SQLite
func InitDB(dataSourceName string) (*sql.DB, error) {
	DriverName = "sqlite"
	db, err := sql.Open("sqlite", dataSourceName)
	if err != nil {
		return nil, fmt.Errorf("error opening sqlite db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to sqlite db: %w", err)
	}

	DB = db

	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("error creating sqlite tables: %w", err)
	}

	return db, nil
}

// InitPostgres initializes production PostgreSQL (Neon)
func InitPostgres(connStr string) (*sql.DB, error) {
	DriverName = "postgres"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("error opening postgres db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to postgres db: %w", err)
	}

	DB = db

	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("error creating postgres tables: %w", err)
	}

	return db, nil
}

// ResetCleanDatabase drops tables and recreates them completely clean with 0 records
func ResetCleanDatabase() error {
	if DriverName == "postgres" {
		dropSchema := `
		DROP TABLE IF EXISTS loans CASCADE;
		DROP TABLE IF EXISTS reservations CASCADE;
		DROP TABLE IF EXISTS news CASCADE;
		DROP TABLE IF EXISTS books CASCADE;
		DROP TABLE IF EXISTS users CASCADE;
		`
		if _, err := DB.Exec(dropSchema); err != nil {
			return err
		}
	} else {
		dropSchema := `
		DROP TABLE IF EXISTS loans;
		DROP TABLE IF EXISTS reservations;
		DROP TABLE IF EXISTS news;
		DROP TABLE IF EXISTS books;
		DROP TABLE IF EXISTS users;
		`
		if _, err := DB.Exec(dropSchema); err != nil {
			return err
		}
	}
	return createTables(DB)
}

// Rebind translates SQL queries with '?' placeholders to PostgreSQL '$1, $2, ...'
func Rebind(query string) string {
	if DriverName != "postgres" {
		return query
	}
	var b strings.Builder
	argIndex := 1
	for i := 0; i < len(query); i++ {
		if query[i] == '?' {
			b.WriteString(fmt.Sprintf("$%d", argIndex))
			argIndex++
		} else {
			b.WriteByte(query[i])
		}
	}
	return b.String()
}

// Helper methods that automatically rebind parameters
func Exec(query string, args ...any) (sql.Result, error) {
	return DB.Exec(Rebind(query), args...)
}

func Query(query string, args ...any) (*sql.Rows, error) {
	return DB.Query(Rebind(query), args...)
}

func QueryRow(query string, args ...any) *sql.Row {
	return DB.QueryRow(Rebind(query), args...)
}

// InsertWithReturnID abstracts LastInsertId (SQLite) vs RETURNING id (PostgreSQL)
func InsertWithReturnID(query string, args ...any) (int64, error) {
	if DriverName == "postgres" {
		q := strings.TrimRight(query, " \t\r\n;") + " RETURNING id"
		var id int64
		err := DB.QueryRow(Rebind(q), args...).Scan(&id)
		return id, err
	}
	res, err := DB.Exec(Rebind(query), args...)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// InsertUserWithReturnID returns user_id
func InsertUserWithReturnID(query string, args ...any) (int64, error) {
	if DriverName == "postgres" {
		q := strings.TrimRight(query, " \t\r\n;") + " RETURNING user_id"
		var id int64
		err := DB.QueryRow(Rebind(q), args...).Scan(&id)
		return id, err
	}
	res, err := DB.Exec(Rebind(query), args...)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func createTables(db *sql.DB) error {
	var schema string
	if DriverName == "postgres" {
		schema = `
		CREATE TABLE IF NOT EXISTS users (
			user_id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			member_number VARCHAR(100) UNIQUE NOT NULL,
			phone VARCHAR(100),
			avatar_url TEXT,
			role VARCHAR(50) DEFAULT 'lector',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS books (
			id SERIAL PRIMARY KEY,
			title VARCHAR(500) NOT NULL,
			author VARCHAR(255) NOT NULL,
			genre VARCHAR(255) NOT NULL,
			isbn VARCHAR(100),
			cover_url TEXT,
			synopsis TEXT,
			location VARCHAR(255),
			format VARCHAR(50) DEFAULT 'physical',
			has_digital BOOLEAN DEFAULT FALSE,
			digital_url TEXT,
			total_copies INTEGER DEFAULT 1,
			available_copies INTEGER DEFAULT 1,
			rating REAL DEFAULT 5.0,
			reviews_count INTEGER DEFAULT 0,
			featured BOOLEAN DEFAULT FALSE
		);

		CREATE TABLE IF NOT EXISTS reservations (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(user_id),
			book_id INTEGER NOT NULL REFERENCES books(id),
			pickup_slot VARCHAR(255) NOT NULL,
			pickup_location VARCHAR(255) NOT NULL,
			note TEXT,
			reservation_code VARCHAR(100) UNIQUE NOT NULL,
			qr_token TEXT NOT NULL,
			status VARCHAR(50) DEFAULT 'ACTIVA',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			expires_at TIMESTAMP WITH TIME ZONE NOT NULL
		);

		CREATE TABLE IF NOT EXISTS loans (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(user_id),
			book_id INTEGER NOT NULL REFERENCES books(id),
			loan_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			due_date TIMESTAMP WITH TIME ZONE NOT NULL,
			returned_date TIMESTAMP WITH TIME ZONE,
			renewals_count INTEGER DEFAULT 0,
			status VARCHAR(50) DEFAULT 'EN_CURSO'
		);

		CREATE TABLE IF NOT EXISTS news (
			id SERIAL PRIMARY KEY,
			title VARCHAR(500) NOT NULL,
			category VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			image_url TEXT,
			published TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			author VARCHAR(255) NOT NULL
		);
		`
	} else {
		schema = `
		CREATE TABLE IF NOT EXISTS users (
			user_id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			member_number TEXT UNIQUE NOT NULL,
			phone TEXT,
			avatar_url TEXT,
			role TEXT DEFAULT 'lector',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS books (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			genre TEXT NOT NULL,
			isbn TEXT,
			cover_url TEXT,
			synopsis TEXT,
			location TEXT,
			format TEXT DEFAULT 'physical',
			has_digital BOOLEAN DEFAULT 0,
			digital_url TEXT,
			total_copies INTEGER DEFAULT 1,
			available_copies INTEGER DEFAULT 1,
			rating REAL DEFAULT 5.0,
			reviews_count INTEGER DEFAULT 0,
			featured BOOLEAN DEFAULT 0
		);

		CREATE TABLE IF NOT EXISTS reservations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			book_id INTEGER NOT NULL,
			pickup_slot TEXT NOT NULL,
			pickup_location TEXT NOT NULL,
			note TEXT,
			reservation_code TEXT UNIQUE NOT NULL,
			qr_token TEXT NOT NULL,
			status TEXT DEFAULT 'ACTIVA',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			expires_at DATETIME NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(user_id),
			FOREIGN KEY (book_id) REFERENCES books(id)
		);

		CREATE TABLE IF NOT EXISTS loans (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			book_id INTEGER NOT NULL,
			loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
			due_date DATETIME NOT NULL,
			returned_date DATETIME,
			renewals_count INTEGER DEFAULT 0,
			status TEXT DEFAULT 'EN_CURSO',
			FOREIGN KEY (user_id) REFERENCES users(user_id),
			FOREIGN KEY (book_id) REFERENCES books(id)
		);

		CREATE TABLE IF NOT EXISTS news (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			category TEXT NOT NULL,
			content TEXT NOT NULL,
			image_url TEXT,
			published DATETIME DEFAULT CURRENT_TIMESTAMP,
			author TEXT NOT NULL
		);
		`
	}
	_, err := db.Exec(schema)
	return err
}
