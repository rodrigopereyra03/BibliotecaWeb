package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// getEnv retrieves an environment variable or a fallback default
func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// GetAppURL returns the web application URL (Render production or localhost)
func GetAppURL() string {
	return getEnv("APP_URL", "https://bibliotecaweb-8w7v.onrender.com")
}

// GetAdminEmail returns the configured notification address for administrators
func GetAdminEmail() string {
	return getEnv("ADMIN_EMAIL", "rodrigopereyra02@gmail.com")
}

// ResendPayload defines the structure for Resend API request
type ResendPayload struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

// Send sends an email synchronously via Resend REST API
func Send(to, subject, htmlContent string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		log.Println("[EMAIL] RESEND_API_KEY no configurada. Omitiendo envío de correo.")
		return nil
	}

	from := getEnv("RESEND_FROM", "Biblioteca Popular San Tito Brandsma <onboarding@resend.dev>")
	to = strings.TrimSpace(to)
	if to == "" {
		return fmt.Errorf("destinatario vacío")
	}

	payload := ResendPayload{
		From:    from,
		To:      []string{to},
		Subject: subject,
		HTML:    htmlContent,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("error serializando payload de email: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("error creando request de email: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[EMAIL ERROR] Error enviando correo a %s: %v\n", to, err)
		return err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		log.Printf("[EMAIL ERROR] Resend status %d para %s: %s\n", resp.StatusCode, to, string(respBody))
		return fmt.Errorf("resend error (%d): %s", resp.StatusCode, string(respBody))
	}

	log.Printf("[EMAIL SUCCESS] Correo enviado con éxito a %s - Asunto: %s\n", to, subject)
	return nil
}

// SendAsync sends an email in a background goroutine so it never blocks HTTP responses
func SendAsync(to, subject, htmlContent string) {
	go func() {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[EMAIL RECOVER] Pánico en envío asíncrono de correo: %v\n", r)
			}
		}()

		err := Send(to, subject, htmlContent)
		if err != nil {
			// Si Resend está en modo prueba (onboarding@resend.dev) y rechaza un destinatario externo,
			// enviamos una copia al email del admin (rodrigopereyra02@gmail.com) para que pueda revisarlo.
			adminEmail := GetAdminEmail()
			if strings.Contains(err.Error(), "can only send testing emails to your own email address") && to != adminEmail {
				log.Printf("[EMAIL NOTE] Reenviando notificación de prueba a %s en nombre de %s\n", adminEmail, to)
				forwardSubject := fmt.Sprintf("[Para Lector: %s] %s", to, subject)
				forwardHTML := fmt.Sprintf(`
					<div style="background-color:#FFF8E7;border:1px solid #FFE58F;border-radius:10px;padding:14px 18px;margin-bottom:20px;font-family:sans-serif;font-size:12px;color:#874D00;line-height:1.5;">
						<strong>Aviso Modo Prueba Resend:</strong> Este correo estaba dirigido a <code>%s</code>. Debido a que el remitente de prueba solo permite envíos a tu cuenta registrada, te lo entregamos en tu casilla de administración para visualización.
					</div>
				`, to) + htmlContent
				_ = Send(adminEmail, forwardSubject, forwardHTML)
			}
		}
	}()
}

// =========================================================================
// PLANTILLAS DE CORREO INSTITUCIONALES (Estilo Parroquial San Tito Brandsma)
// =========================================================================

func renderEmailLayout(badgeText, kickerTitle, title, contentHTML string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%s</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2B2118;line-height:1.6;">
  <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F5F1EA;padding:36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%%;background-color:#FFFFFF;border:1px solid #E6DED4;border-radius:20px;overflow:hidden;box-shadow:0 10px 25px rgba(43,33,24,0.06);">
          
          <!-- Top Accent Gold Strip -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg, #9E2A2B 0%%, #B8860B 50%%, #D4AF37 100%%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color:#7A2021;padding:34px 36px 28px;text-align:center;">
              <div style="display:inline-block;padding:5px 14px;background-color:rgba(184,134,11,0.25);border:1px solid rgba(212,175,55,0.4);border-radius:20px;margin-bottom:12px;">
                <span style="color:#F5DEB3;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                  ✦ Parroquia & Biblioteca Popular ✦
                </span>
              </div>
              <h1 style="margin:0;color:#FFFFFF;font-family:'Georgia',serif;font-size:25px;font-weight:normal;letter-spacing:-0.5px;line-height:1.2;">
                San Tito Brandsma
              </h1>
              <p style="margin:8px 0 0 0;color:#F0E4D2;font-size:12px;letter-spacing:0.3px;">
                Capilla Nuestra Señora de Lourdes · Sigmund Freud 201, Temperley
              </p>
            </td>
          </tr>

          <!-- Banner Kicker -->
          <tr>
            <td style="background-color:#FAF7F2;padding:18px 36px;border-bottom:1px solid #EFE9E0;">
              <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:3px 10px;background-color:#EFE5D2;color:#856404;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-radius:6px;margin-bottom:4px;">
                      %s
                    </span>
                    <h2 style="margin:0;color:#2B2118;font-family:'Georgia',serif;font-size:19px;font-weight:bold;line-height:1.3;">
                      %s
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding:32px 36px;color:#3D2F24;font-size:14px;line-height:1.65;">
              %s
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#FAF7F2;padding:24px 36px;border-top:1px solid #EFE9E0;text-align:center;font-size:12px;color:#7A6A5C;">
              <p style="margin:0 0 5px 0;font-weight:bold;color:#3D2A1D;">
                Biblioteca Popular San Tito Brandsma · Capilla Nuestra Señora de Lourdes
              </p>
              <p style="margin:0 0 10px 0;">
                Sigmund Freud 201, Temperley · Horarios de Despacho: 8:30 AM a 2:00 PM
              </p>
              <p style="margin:0;font-size:11px;color:#A09080;">
                Diócesis de Lomas de Zamora · Si recibiste este correo por error, puedes desestimarlo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`, title, badgeText, kickerTitle, contentHTML)
}

// 1. Notificación: Nuevo Lector Registrado (Bienvenida al Usuario)
func SendWelcomeEmail(readerName, readerEmail, memberNumber string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:16px;margin-top:0;color:#1A130E;">
			Paz y bien, <strong style="color:#7A2021;">%s</strong>:
		</p>
		<p style="margin-bottom:22px;color:#524235;">
			Nos alegra darte la bienvenida a la <strong>Biblioteca Popular San Tito Brandsma</strong>. Tu cuenta de lector ya fue activada y te habilita a reservar y retirar libros a domicilio sin costo alguno.
		</p>

		<!-- Carnet de Lector Digital Mockup -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background:linear-gradient(145deg, #FAF7F2 0%%, #F2ECE1 100%%);border:2px solid #D4AF37;border-radius:14px;margin:22px 0;box-shadow:0 4px 14px rgba(184,134,11,0.08);">
			<tr>
				<td style="padding:22px 24px;">
					<table width="100%%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td>
								<span style="font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:#8B7355;font-weight:bold;display:block;">
									Credencial Oficial de Lector
								</span>
								<span style="font-family:'Georgia',serif;font-size:18px;font-weight:bold;color:#7A2021;display:block;margin-top:2px;">
									%s
								</span>
								<span style="font-size:12px;color:#6B5845;">
									Socio Activo · Capilla Ntra. Sra. de Lourdes
								</span>
							</td>
							<td align="right" valign="top">
								<div style="background-color:#7A2021;color:#FFFFFF;padding:6px 14px;border-radius:8px;font-family:monospace;font-size:16px;font-weight:bold;letter-spacing:1px;display:inline-block;border:1px solid #B8860B;">
									#%s
								</div>
							</td>
						</tr>
						<tr>
							<td colspan="2" style="padding-top:14px;border-top:1px dashed #D8CEBE;margin-top:14px;">
								<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;color:#7A6855;">
									<tr>
										<td>📍 Sede: Sigmund Freud 201, Temperley</td>
										<td align="right">📖 Préstamos: 21 días libres</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		<h3 style="font-family:'Georgia',serif;color:#7A2021;font-size:16px;margin:26px 0 12px 0;">
			¿Cómo retirar tus libros?
		</h3>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
			<tr>
				<td style="padding:10px 0;border-bottom:1px solid #F0EAE1;">
					<strong style="color:#2B2118;">1. Reserva desde la Web:</strong> Elige cualquier título del catálogo parroquial y resérvalo con un clic.
				</td>
			</tr>
			<tr>
				<td style="padding:10px 0;border-bottom:1px solid #F0EAE1;">
					<strong style="color:#2B2118;">2. Retira en el Atrio:</strong> Acércate a la secretaría con tu número de credencial o pase QR digital.
				</td>
			</tr>
			<tr>
				<td style="padding:10px 0;">
					<strong style="color:#2B2118;">3. 21 Días de Lectura:</strong> Disfruta de la obra en casa con posibilidad de renovación online.
				</td>
			</tr>
		</table>

		<!-- Call to Action Button -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:13px 30px;background-color:#B8860B;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:14px;border-radius:10px;box-shadow:0 4px 10px rgba(184,134,11,0.25);letter-spacing:0.3px;">
						Explorar el Catálogo de Libros →
					</a>
				</td>
			</tr>
		</table>

		<p style="margin-top:26px;color:#7A6A5C;font-size:13px;text-align:center;">
			<em>"Un libro es un puente entre corazones y una ventana a la esperanza de nuestra comunidad."</em>
		</p>
	`, readerName, readerName, memberNumber, appURL)

	html := renderEmailLayout("Padrón de Lectores", "¡Bienvenido a nuestra comunidad de lectura!", "Bienvenida a la Biblioteca San Tito Brandsma", content)
	SendAsync(readerEmail, fmt.Sprintf("¡Bienvenido a la Biblioteca San Tito Brandsma! - Credencial #%s", memberNumber), html)
}

// 1b. Notificación al Admin: Nuevo Registro
func SendNewUserAdminEmail(adminEmail, readerName, readerEmail, memberNumber, phone, address string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;color:#2B2118;">
			Se ha incorporado un nuevo socio lector al registro parroquial:
		</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="10" style="font-size:13px;border-collapse:collapse;margin:18px 0;background:#FAF7F2;border:1px solid #E6DED4;border-radius:12px;">
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td width="36%%" style="font-weight:bold;color:#7A6A5C;">Lector / Titular:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Correo Electrónico:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Número de Credencial:</td>
				<td style="font-family:monospace;font-weight:bold;color:#7A2021;font-size:14px;">#%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Teléfono / WhatsApp:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Domicilio en Temperley:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
		</table>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:24px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:12px 26px;background-color:#7A2021;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:13px;border-radius:8px;">
						Ver en Miembros del Backoffice →
					</a>
				</td>
			</tr>
		</table>
	`, readerName, readerEmail, memberNumber, phone, address, appURL)

	html := renderEmailLayout("Gestión de Miembros", "Nuevo Lector Registrado en la Comunidad", "Nuevo Lector Registrado", content)
	SendAsync(adminEmail, fmt.Sprintf("Nuevo Lector Registrado: %s (#%s)", readerName, memberNumber), html)
}

// 2. Notificación al Admin: Solicitud de Reserva de Libro
func SendReservationAdminEmail(adminEmail, readerName, readerEmail, bookTitle, author, reservationCode, pickupSlot string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;color:#2B2118;">
			Un lector ha generado una solicitud de retiro para el mostrador:
		</p>
		
		<!-- Ticket Box -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background:#FFFDF9;border:2px dashed #B8860B;border-radius:12px;margin:20px 0;">
			<tr>
				<td style="padding:18px 22px;text-align:center;">
					<span style="font-size:11px;text-transform:uppercase;color:#8B7355;font-weight:bold;letter-spacing:1px;display:block;">
						Código de Reserva
					</span>
					<span style="font-family:monospace;font-size:24px;font-weight:bold;color:#7A2021;letter-spacing:1px;display:block;margin:4px 0;">
						%s
					</span>
					<span style="font-size:12px;color:#554433;">
						Turno: <strong>%s</strong>
					</span>
				</td>
			</tr>
		</table>

		<table width="100%%" border="0" cellspacing="0" cellpadding="10" style="font-size:13px;border-collapse:collapse;margin:18px 0;background:#FAF7F2;border:1px solid #E6DED4;border-radius:12px;">
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td width="36%%" style="font-weight:bold;color:#7A6A5C;">Título de la Obra:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Autoría:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Socio Lector:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
		</table>

		<p style="font-size:12px;color:#7A6A5C;margin-top:14px;">
			El ejemplar ha sido descontado automáticamente del catálogo disponible por 48 horas.
		</p>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:24px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:12px 26px;background-color:#B8860B;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:13px;border-radius:8px;">
						Abrir Circulación & Despacho →
					</a>
				</td>
			</tr>
		</table>
	`, reservationCode, pickupSlot, bookTitle, author, readerName, readerEmail, appURL)

	html := renderEmailLayout("Circulación y Despacho", "Pase pendiente de entrega en el atrio", "Nueva Reserva de Libro", content)
	SendAsync(adminEmail, fmt.Sprintf("Nueva Reserva: \"%s\" (Lector: %s)", bookTitle, readerName), html)
}

// 2b. Confirmación al Lector de su Reserva
func SendReservationReaderEmail(readerName, readerEmail, bookTitle, author, reservationCode, pickupSlot string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:16px;margin-top:0;color:#1A130E;">
			Estimado/a <strong style="color:#7A2021;">%s</strong>:
		</p>
		<p style="margin-bottom:20px;color:#524235;">
			Tu pedido de reserva para la obra <strong>"%s"</strong> de <em>%s</em> ya fue confirmado.
		</p>
		
		<!-- Ticket de Retiro -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background:#FFFDF9;border:2px dashed #B8860B;border-radius:12px;margin:20px 0;box-shadow:0 3px 10px rgba(0,0,0,0.03);">
			<tr>
				<td style="padding:22px;text-align:center;">
					<span style="font-size:10px;text-transform:uppercase;color:#8B7355;font-weight:bold;letter-spacing:1px;display:block;">
						Presenta este Código en Mostrador
					</span>
					<span style="font-family:monospace;font-size:26px;font-weight:bold;color:#7A2021;letter-spacing:2px;display:block;margin:6px 0;">
						%s
					</span>
					<div style="display:inline-block;padding:4px 12px;background:#F5EFEB;border-radius:20px;font-size:12px;color:#554433;font-weight:600;margin-top:4px;">
						Turno: %s
					</div>
				</td>
			</tr>
		</table>

		<div style="background-color:#FAF7F2;border:1px solid #E6DED4;border-radius:10px;padding:16px;margin:20px 0;font-size:13px;color:#4A3B2C;">
			<p style="margin:0 0 8px 0;font-weight:bold;color:#2B2118;">📍 Punto de Retiro:</p>
			<p style="margin:0 0 8px 0;">Secretaría de la Capilla Ntra. Sra. de Lourdes · Sigmund Freud 201, Temperley.</p>
			<p style="margin:0;font-size:12px;color:#7A6A5C;">⏳ Tienes un plazo de <strong>48 horas</strong> para retirar tu ejemplar.</p>
		</div>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:13px 30px;background-color:#B8860B;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:14px;border-radius:10px;">
						Ver Mi Pase de Reserva en la Web →
					</a>
				</td>
			</tr>
		</table>
	`, readerName, bookTitle, author, reservationCode, pickupSlot, appURL)

	html := renderEmailLayout("Reserva Activa", "Tu ejemplar ya está apartado en el atrio", "Reserva Confirmada con Éxito", content)
	SendAsync(readerEmail, fmt.Sprintf("Reserva Confirmada: \"%s\" - Código #%s", bookTitle, reservationCode), html)
}

// 3. Notificación: Retiro de Libro / Préstamo Activo (Para el Lector)
func SendLoanDeliveredReaderEmail(readerName, readerEmail, bookTitle, author, dueDateStr string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:16px;margin-top:0;color:#1A130E;">
			¡Que disfrutes tu lectura, <strong style="color:#7A2021;">%s</strong>!
		</p>
		<p style="margin-bottom:20px;color:#524235;">
			Confirmamos la entrega física del libro <strong>"%s"</strong> de <em>%s</em> en el mostrador parroquial.
		</p>
		
		<!-- Due Date Banner Card -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:12px;margin:22px 0;">
			<tr>
				<td style="padding:22px;text-align:center;">
					<span style="font-size:10px;text-transform:uppercase;color:#166534;font-weight:bold;letter-spacing:1px;display:block;">
						Fecha Límite de Devolución
					</span>
					<span style="font-family:'Georgia',serif;font-size:26px;font-weight:bold;color:#14532D;display:block;margin:6px 0;">
						%s
					</span>
					<span style="font-size:12px;color:#15803D;font-weight:600;">
						✓ Plazo reglamentario de 21 días corridos
					</span>
				</td>
			</tr>
		</table>

		<p style="font-size:13px;color:#554433;">
			Si necesitas más días para completar tu lectura, recuerda que puedes solicitar una <strong>prórroga gratuita</strong> desde el portal de lectores antes del vencimiento.
		</p>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:13px 30px;background-color:#15803D;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:14px;border-radius:10px;">
						Ver Mis Préstamos en la Web →
					</a>
				</td>
			</tr>
		</table>
	`, readerName, bookTitle, author, dueDateStr, appURL)

	html := renderEmailLayout("Préstamo en Curso", "Comienza tu período de lectura domiciliaria", "Préstamo Confirmado", content)
	SendAsync(readerEmail, fmt.Sprintf("Préstamo Confirmado: \"%s\" (Vence: %s)", bookTitle, dueDateStr), html)
}

// 3b. Notificación: Retiro de Libro (Para el Admin)
func SendLoanDeliveredAdminEmail(adminEmail, readerName, readerEmail, bookTitle, dueDateStr string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;color:#2B2118;">
			Se ha completado la entrega de un ejemplar en el atrio parroquial:
		</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="10" style="font-size:13px;border-collapse:collapse;margin:18px 0;background:#FAF7F2;border:1px solid #E6DED4;border-radius:12px;">
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td width="36%%" style="font-weight:bold;color:#7A6A5C;">Libro Retirado:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Entregado a:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Fecha de Vencimiento:</td>
				<td style="font-weight:bold;color:#7A2021;">%s</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Estado:</td>
				<td style="color:#15803D;font-weight:bold;">EN_CURSO (21 Días)</td>
			</tr>
		</table>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:22px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:12px 26px;background-color:#7A2021;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:13px;border-radius:8px;">
						Ver Préstamos Activos en Backoffice →
					</a>
				</td>
			</tr>
		</table>
	`, bookTitle, readerName, readerEmail, dueDateStr, appURL)

	html := renderEmailLayout("Circulación Parroquial", "Entrega física de ejemplar registrada", "Retiro de Ejemplar Confirmado", content)
	SendAsync(adminEmail, fmt.Sprintf("Retiro Confirmado: \"%s\" a %s", bookTitle, readerName), html)
}

// 4. Notificación: Devolución de Libro (Para el Lector)
func SendLoanReturnedReaderEmail(readerName, readerEmail, bookTitle string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:16px;margin-top:0;color:#1A130E;">
			¡Muchas gracias, <strong style="color:#7A2021;">%s</strong>!
		</p>
		<p style="margin-bottom:20px;color:#524235;">
			Confirmamos que hemos recibido la devolución del libro <strong>"%s"</strong> en perfectas condiciones.
		</p>
		
		<!-- Return Success Box -->
		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:12px;margin:22px 0;">
			<tr>
				<td style="padding:22px;text-align:center;">
					<span style="font-size:26px;display:block;margin-bottom:6px;">✓</span>
					<span style="font-size:12px;font-weight:bold;color:#166534;text-transform:uppercase;letter-spacing:1px;display:block;">
						Préstamo Completado & Devuelto
					</span>
					<p style="margin:6px 0 0 0;font-size:12px;color:#14532D;">
						Tu historial ha quedado al día y puedes reservar nuevos ejemplares.
					</p>
				</td>
			</tr>
		</table>

		<p style="font-size:13px;color:#554433;text-align:center;margin:20px 0;">
			Gracias por cuidar el patrimonio literario de nuestra comunidad parroquial.
		</p>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:13px 30px;background-color:#B8860B;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:14px;border-radius:10px;">
						Elegir Mi Próximo Libro →
					</a>
				</td>
			</tr>
		</table>
	`, readerName, bookTitle, appURL)

	html := renderEmailLayout("Historial de Lectura", "Devolución registrada en mostrador", "Devolución Confirmada con Éxito", content)
	SendAsync(readerEmail, fmt.Sprintf("Devolución Confirmada: \"%s\" - Biblioteca San Tito Brandsma", bookTitle), html)
}

// 4b. Notificación: Devolución de Libro (Para el Admin)
func SendLoanReturnedAdminEmail(adminEmail, readerName, readerEmail, bookTitle string) {
	appURL := GetAppURL()
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;color:#2B2118;">
			Se ha recibido una devolución física en el atrio parroquial:
		</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="10" style="font-size:13px;border-collapse:collapse;margin:18px 0;background:#FAF7F2;border:1px solid #E6DED4;border-radius:12px;">
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td width="36%%" style="font-weight:bold;color:#7A6A5C;">Libro Devuelto:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #EFE9E0;">
				<td style="font-weight:bold;color:#7A6A5C;">Devuelto por:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Stock Restaurado:</td>
				<td style="color:#15803D;font-weight:bold;">+1 Copia reintegrada al catálogo</td>
			</tr>
		</table>

		<table width="100%%" border="0" cellspacing="0" cellpadding="0" style="margin:22px 0 10px;">
			<tr>
				<td align="center">
					<a href="%s" target="_blank" style="display:inline-block;padding:12px 26px;background-color:#7A2021;color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:13px;border-radius:8px;">
						Ver Inventario en Backoffice →
					</a>
				</td>
			</tr>
		</table>
	`, bookTitle, readerName, readerEmail, appURL)

	html := renderEmailLayout("Inventario Parroquial", "Reingreso físico de ejemplar registrado", "Devolución Recibida en Mostrador", content)
	SendAsync(adminEmail, fmt.Sprintf("Devolución Recibida: \"%s\" por %s", bookTitle, readerName), html)
}
