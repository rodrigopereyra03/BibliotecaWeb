package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

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

	if err := seedData(db); err != nil {
		log.Printf("Warning: seed data skipped or failed: %v", err)
	}

	return db, nil
}

// InitPostgres initializes production PostgreSQL (Neon, Supabase, Render, Railway, etc.)
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

	if err := seedData(db); err != nil {
		log.Printf("Warning: seed data skipped or failed: %v", err)
	}

	return db, nil
}

// Rebind translates SQL queries with '?' placeholders to PostgreSQL '$1, $2, ...' when connected to Postgres
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

func createTables(db *sql.DB) error {
	var schema string
	if DriverName == "postgres" {
		schema = `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
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
			user_id INTEGER NOT NULL REFERENCES users(id),
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
			user_id INTEGER NOT NULL REFERENCES users(id),
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
			id INTEGER PRIMARY KEY AUTOINCREMENT,
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
			FOREIGN KEY (user_id) REFERENCES users(id),
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
			FOREIGN KEY (user_id) REFERENCES users(id),
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

func seedData(db *sql.DB) error {
	var count int
	err := QueryRow("SELECT COUNT(*) FROM books").Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil // Ya tiene datos
	}

	// 1. Usuario de prueba por defecto (David Miller / Vecino Lector)
	_, err = Exec(`
		INSERT INTO users (id, name, email, member_number, phone, avatar_url, role)
		VALUES (1, 'David Miller', 'david.miller@vecinos.org', 'GT-4821', '+54 11 5555-1234', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'lector')
	`)
	if err != nil {
		log.Printf("User seed error: %v", err)
	}

	// 2. Libros variados (Novelas, Terror, Cuentos, Suspenso, etc.)
	books := []struct {
		title, author, genre, isbn, cover, synopsis, location, format string
		hasDigital                                                   bool
		copies, available                                            int
		rating                                                       float64
		reviews                                                      int
		featured                                                     bool
	}{
		{
			title:       "Cien Años de Soledad",
			author:      "Gabriel García Márquez",
			genre:       "Novelas & Ficción",
			isbn:        "978-0307474728",
			cover:       "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Cúspide de la narrativa hispanoamericana que recrea la epopeya de Macondo y las siete generaciones de la estirpe Buendía, entrelazando la historia íntima con el lirismo y la mitología universal.",
			location:    "Recepción Principal · Sector Narrativa Latinoamericana, Estante 2B",
			format:      "both",
			hasDigital:  true,
			copies:      4,
			available:   3,
			rating:      5.0,
			reviews:     94,
			featured:    true,
		},
		{
			title:       "El Resplandor",
			author:      "Stephen King",
			genre:       "Terror & Misterio",
			isbn:        "978-0307743657",
			cover:       "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Un clásico absoluto del terror psicológico. Jack Torrance acepta el empleo de cuidador de invierno en el solitario hotel Overlook junto a su esposa y su hijo Danny, dotado de un don psíquico perturbador.",
			location:    "Sector Novela Negra & Terror · Estante 5A",
			format:      "physical",
			hasDigital:  false,
			copies:      3,
			available:   2,
			rating:      4.9,
			reviews:     78,
			featured:    false,
		},
		{
			title:       "Diez Negritos (Y No Quedó Ninguno)",
			author:      "Agatha Christie",
			genre:       "Suspenso & Policial",
			isbn:        "978-8467035414",
			cover:       "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Diez personas sin relación aparente son invitadas a pasar un fin de semana en una misteriosa isla privada. Uno a uno, los invitados empiezan a ser asesinados siguiendo la macabra letra de una canción infantil.",
			location:    "Sector Misterio & Clásicos Policiales · Estante 3C",
			format:      "both",
			hasDigital:  true,
			copies:      5,
			available:   4,
			rating:      4.9,
			reviews:     112,
			featured:    false,
		},
		{
			title:       "Ficciones",
			author:      "Jorge Luis Borges",
			genre:       "Cuentos & Fantasía",
			isbn:        "978-0307950925",
			cover:       "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Conjunto de relatos fundamentales de Borges divididos en 'El jardín de senderos que se bifurcan' y 'Artificios'. Laberintos, espejos, paradojas y la biblioteca infinita de Babel.",
			location:    "Sector Literatura Argentina · Estante 1A",
			format:      "both",
			hasDigital:  true,
			copies:      3,
			available:   1,
			rating:      5.0,
			reviews:     85,
			featured:    true,
		},
		{
			title:       "La Llamada de Cthulhu y Otros Relatos",
			author:      "H.P. Lovecraft",
			genre:       "Terror & Misterio",
			isbn:        "978-8420651262",
			cover:       "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Pilar del horror cósmico. Antiguas deidades dormidas en los abismos oceánicos despiertan amenazando la cordura y el destino de la humanidad.",
			location:    "Sector Terror & Fantasía Oscura · Estante 5B",
			format:      "both",
			hasDigital:  true,
			copies:      2,
			available:   2,
			rating:      4.8,
			reviews:     63,
			featured:    false,
		},
		{
			title:       "El Nombre de la Rosa",
			author:      "Umberto Eco",
			genre:       "Suspenso & Policial",
			isbn:        "978-8426418197",
			cover:       "https://images.unsplash.com/photo-1532012164546-f432f2e37b29?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Invierno de 1327. El fraile franciscano Guillermo de Baskerville llega a una remota abadía en el norte de Italia para investigar una serie de muertes inexplicables vinculadas a una biblioteca secreta.",
			location:    "Fondo Histórico y Novela de Enigma · Estante 4A",
			format:      "physical",
			hasDigital:  false,
			copies:      3,
			available:   1,
			rating:      4.9,
			reviews:     91,
			featured:    false,
		},
		{
			title:       "1984",
			author:      "George Orwell",
			genre:       "Novelas & Ficción",
			isbn:        "978-0451524935",
			cover:       "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Inmortal distopía sobre la vigilancia totalitaria, la manipulación de la verdad histórica y la rebelión de Winston Smith contra el Gran Hermano.",
			location:    "Sector Clásicos del Siglo XX · Estante 2C",
			format:      "both",
			hasDigital:  true,
			copies:      6,
			available:   5,
			rating:      4.9,
			reviews:     134,
			featured:    false,
		},
		{
			title:       "Relatos de un Náufrago",
			author:      "Gabriel García Márquez",
			genre:       "Novelas & Ficción",
			isbn:        "978-0307387349",
			cover:       "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
			synopsis:    "La crónica verídica de Luis Alejandro Velasco, marinero que estuvo diez días a la deriva en una balsa sin comer ni beber en el mar Caribe.",
			location:    "Sector Crónicas & Periodismo Narrativo · Estante 2B",
			format:      "physical",
			hasDigital:  false,
			copies:      3,
			available:   3,
			rating:      4.7,
			reviews:     42,
			featured:    false,
		},
		{
			title:       "El Aleph",
			author:      "Jorge Luis Borges",
			genre:       "Cuentos & Fantasía",
			isbn:        "978-8420658513",
			cover:       "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Obra maestra del cuento fantástico. En el sótano de una vieja casa de la calle Garay se encuentra el Aleph, el punto que contiene todos los puntos del universo simultáneamente.",
			location:    "Sector Clásicos Argentinos · Estante 1A",
			format:      "both",
			hasDigital:  true,
			copies:      4,
			available:   3,
			rating:      5.0,
			reviews:     108,
			featured:    false,
		},
		{
			title:       "It (Eso)",
			author:      "Stephen King",
			genre:       "Terror & Misterio",
			isbn:        "978-1501142970",
			cover:       "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80",
			synopsis:    "En el pueblo de Derry, un grupo de niños marginados enfrenta a una entidad ancestral que despierta cada 27 años para alimentarse del miedo y adoptar la forma de sus peores pesadillas.",
			location:    "Sector Terror & Suspense · Estante 5A",
			format:      "physical",
			hasDigital:  false,
			copies:      4,
			available:   3,
			rating:      4.9,
			reviews:     156,
			featured:    false,
		},
		{
			title:       "El Cuervo y Cuentos Extraordinarios",
			author:      "Edgar Allan Poe",
			genre:       "Cuentos & Fantasía",
			isbn:        "978-8420674209",
			cover:       "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
			synopsis:    "Compendio insuperable de horror gótico y misterio deductivo. Incluye 'El corazón delator', 'El gato negro', 'La caída de la casa Usher' y 'Los crímenes de la calle Morgue'.",
			location:    "Sector Clásicos Góticos · Estante 3A",
			format:      "both",
			hasDigital:  true,
			copies:      3,
			available:   2,
			rating:      4.8,
			reviews:     98,
			featured:    false,
		},
		{
			title:       "Sherlock Holmes: Estudio en Escarlata",
			author:      "Arthur Conan Doyle",
			genre:       "Suspenso & Policial",
			isbn:        "978-8420674339",
			cover:       "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=600&q=80",
			synopsis:    "La primera aventura que unió al célebre detective consultor Sherlock Holmes con el Dr. John H. Watson para desentrañar un misterioso crimen con la palabra 'RACHE' escrita en sangre.",
			location:    "Sector Policial Clásico · Estante 3B",
			format:      "both",
			hasDigital:  true,
			copies:      4,
			available:   3,
			rating:      4.9,
			reviews:     120,
			featured:    false,
		},
	}

	for _, b := range books {
		_, err := Exec(`
			INSERT INTO books (title, author, genre, isbn, cover_url, synopsis, location, format, has_digital, total_copies, available_copies, rating, reviews_count, featured)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, b.title, b.author, b.genre, b.isbn, b.cover, b.synopsis, b.location, b.format, b.hasDigital, b.copies, b.available, b.rating, b.reviews, b.featured)
		if err != nil {
			log.Printf("Book seed error: %v", err)
		}
	}

	// 3. Reservas de prueba activas (para Mis Reservas y Pase QR)
	now := time.Now()
	_, err = Exec(`
		INSERT INTO reservations (user_id, book_id, pickup_slot, pickup_location, note, reservation_code, qr_token, status, created_at, expires_at)
		VALUES (1, 1, 'Turno Mañana (10:00 a 13:00 hs)', 'Atrio Central · Mostrador Principal', 'Retiro dominical tras la misa', 'RES-LOURDES-7829', 'QR-TOKEN-LOURDES-7829', 'ACTIVA', ?, ?)
	`, now, now.Add(48*time.Hour))
	if err != nil {
		log.Printf("Reservation seed error: %v", err)
	}

	// 4. Préstamos de prueba (para el Historial de Préstamos)
	_, err = Exec(`
		INSERT INTO loans (user_id, book_id, loan_date, due_date, renewals_count, status)
		VALUES (1, 4, ?, ?, 1, 'EN_CURSO')
	`, now.Add(-10*24*time.Hour), now.Add(11*24*time.Hour))
	if err != nil {
		log.Printf("Loan seed error: %v", err)
	}

	retDate := now.Add(-30 * 24 * time.Hour)
	_, err = Exec(`
		INSERT INTO loans (user_id, book_id, loan_date, due_date, returned_date, renewals_count, status)
		VALUES (1, 7, ?, ?, ?, 0, 'DEVUELTO')
	`, now.Add(-55*24*time.Hour), now.Add(-34*24*time.Hour), retDate)
	if err != nil {
		log.Printf("Past loan seed error: %v", err)
	}

	// 5. Noticias y Cartelera Comunitaria
	news := []struct {
		title, category, content, image, author string
	}{
		{
			title:    "Llegaron más de 50 nuevas novelas y cuentos a la biblioteca",
			category: "Comunidad",
			content:  "Gracias a las generosas donaciones de vecinos y amigos del barrio, incorporamos obras contemporáneas, misterio de Agatha Christie y grandes clásicos de la narrativa argentina e internacional.",
			image:    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
			author:   "Comisión de Biblioteca",
		},
		{
			title:    "Club de Lectura Barrial: Encuentro de Cuentos y Misterio",
			category: "Club de Lectura",
			content:  "Nos reunimos todos los jueves a las 18:30 hs en el salón anexo para comentar relatos de Borges, Cortázar y Quiroga. Entrada libre y mate compartido para toda la comunidad.",
			image:    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
			author:   "Coordinación Parroquial",
		},
		{
			title:    "Campaña de Digitalización y Pase Rápido QR",
			category: "Servicios",
			content:  "Ya podés reservar tus ejemplares desde la web y retirar directamente en el atrio con tu código QR sin demoras tras la Santa Misa o en los horarios de secretaría.",
			image:    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
			author:   "Equipo de Secretaría",
		},
	}

	for _, n := range news {
		_, err := Exec(`
			INSERT INTO news (title, category, content, image_url, author)
			VALUES (?, ?, ?, ?, ?)
		`, n.title, n.category, n.content, n.image, n.author)
		if err != nil {
			log.Printf("News seed error: %v", err)
		}
	}

	return nil
}
