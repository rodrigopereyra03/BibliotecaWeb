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

// GetEnv retrieves an environment variable or a fallback default
func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
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
			adminEmail := getEnv("ADMIN_EMAIL", "rodrigopereyra02@gmail.com")
			if strings.Contains(err.Error(), "can only send testing emails to your own email address") && to != adminEmail {
				log.Printf("[EMAIL NOTE] Reenviando notificación de prueba a %s en nombre de %s\n", adminEmail, to)
				forwardSubject := fmt.Sprintf("[Para Lector: %s] %s", to, subject)
				forwardHTML := fmt.Sprintf(`
					<div style="background:#FFF3CD;padding:12px;border:1px solid #FFEEBA;border-radius:8px;font-size:12px;margin-bottom:16px;color:#856404;font-family:sans-serif;">
						<strong>Aviso Modo Prueba Resend:</strong> Este correo estaba dirigido a <code>%s</code>. Debido a que el dominio de prueba de Resend solo permite envíos directos a la cuenta propietaria, te enviamos la copia a tu casilla de administrador.
					</div>
				`, to) + htmlContent
				_ = Send(adminEmail, forwardSubject, forwardHTML)
			}
		}
	}()
}

// GetAdminEmail returns the configured notification address for administrators
func GetAdminEmail() string {
	return getEnv("ADMIN_EMAIL", "rodrigopereyra02@gmail.com")
}

// =========================================================================
// PLANTILLAS DE CORREO INSTITUCIONALES (Estilo Parroquial San Tito Brandsma)
// =========================================================================

func renderEmailLayout(title, subtitle, contentHTML string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%s</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:'Georgia',serif;color:#2B2118;line-height:1.6;">
  <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FAF8F5;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%%;background-color:#FFFFFF;border:1px solid #E5DCCF;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          
          <!-- Institutional Header -->
          <tr>
            <td style="background-color:#7A2021;padding:28px 32px;text-align:center;">
              <span style="display:inline-block;padding:4px 12px;background-color:#B8860B;color:#FFFFFF;font-family:sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-radius:20px;margin-bottom:10px;">
                Biblioteca Popular
              </span>
              <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:normal;letter-spacing:-0.5px;">
                San Tito Brandsma
              </h1>
              <p style="margin:6px 0 0 0;color:#F0E4D2;font-size:12px;font-family:sans-serif;">
                Capilla Nuestra Señora de Lourdes · Sigmund Freud 201, Temperley
              </p>
            </td>
          </tr>

          <!-- Banner Title -->
          <tr>
            <td style="background-color:#F5EFEB;padding:18px 32px;border-bottom:1px solid #E5DCCF;">
              <h2 style="margin:0;color:#3D2A1D;font-size:18px;font-weight:bold;">
                %s
              </h2>
              <p style="margin:4px 0 0 0;color:#7A6A5C;font-size:13px;font-family:sans-serif;">
                %s
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;font-size:14px;color:#2B2118;">
              %s
            </td>
          </tr>

          <!-- Parish Footer -->
          <tr>
            <td style="background-color:#FAF8F5;padding:24px 32px;border-top:1px solid #E5DCCF;text-align:center;font-family:sans-serif;font-size:12px;color:#7A6A5C;">
              <p style="margin:0 0 6px 0;font-weight:bold;color:#3D2A1D;">
                Capilla Nuestra Señora de Lourdes · Diócesis de Lomas de Zamora
              </p>
              <p style="margin:0 0 10px 0;">
                Sigmund Freud 201, Temperley · Atención: 8:30 AM a 2:00 PM
              </p>
              <p style="margin:0;font-size:11px;color:#998877;">
                <em>"Bajo el amparo de la Virgen, cultivamos el saber y la lectura compartida."</em>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`, title, title, subtitle, contentHTML)
}

// 1. Notificación: Nuevo Lector Registrado (Bienvenida al Usuario)
func SendWelcomeEmail(readerName, readerEmail, memberNumber string) {
	content := fmt.Sprintf(`
		<p style="font-size:16px;margin-top:0;">¡Paz y bien, <strong>%s</strong>!</p>
		<p>Te damos la más cálida bienvenida a la <strong>Biblioteca Popular San Tito Brandsma</strong> de la Capilla Nuestra Señora de Lourdes.</p>
		
		<div style="background-color:#FAF8F5;border:1px solid #E5DCCF;border-left:4px solid #B8860B;border-radius:8px;padding:16px;margin:20px 0;">
			<span style="font-size:11px;font-family:sans-serif;text-transform:uppercase;color:#7A6A5C;font-weight:bold;display:block;">Número de Credencial Oficial</span>
			<span style="font-size:22px;font-family:monospace;font-weight:bold;color:#7A2021;">#%s</span>
			<p style="margin:6px 0 0 0;font-size:12px;color:#554433;">Presenta este número o tu pase QR digital en la secretaría parroquial para retirar tus libros.</p>
		</div>

		<h3 style="color:#7A2021;font-size:15px;margin:24px 0 8px 0;border-bottom:1px solid #E5DCCF;padding-bottom:6px;">Reglamento General de Préstamos:</h3>
		<ul style="padding-left:20px;margin:10px 0;font-size:13px;color:#443322;">
			<li><strong>Plazo gratuito:</strong> 21 días corridos por cada ejemplar.</li>
			<li><strong>Prórroga:</strong> Puedes solicitar renovaciones en línea desde el portal web.</li>
			<li><strong>Retiro en sede:</strong> Capilla Ntra. Sra. de Lourdes, Sigmund Freud 201, Temperley.</li>
		</ul>

		<p style="margin-top:24px;">Ya puedes explorar nuestro catálogo y reservar tus primeras lecturas.</p>
		<p style="margin-bottom:0;"><em>Fraternalmente,<br><strong>Equipo de la Biblioteca Parroquial</strong></em></p>
	`, readerName, memberNumber)

	html := renderEmailLayout("Bienvenida a la Comunidad de Lectores", "Tu credencial parroquial ya se encuentra activa", content)
	SendAsync(readerEmail, fmt.Sprintf("¡Bienvenido a la Biblioteca San Tito Brandsma! - Credencial #%s", memberNumber), html)
}

// 1b. Notificación al Admin: Nuevo Registro
func SendNewUserAdminEmail(adminEmail, readerName, readerEmail, memberNumber, phone, address string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Se ha registrado un nuevo lector en la plataforma comunitaria:</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="8" style="font-size:13px;border-collapse:collapse;margin:16px 0;background:#FAF8F5;border-radius:8px;">
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td width="35%%" style="font-weight:bold;color:#7A6A5C;">Lector / Nombre:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Correo Electrónico:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Número de Credencial:</td>
				<td style="font-weight:bold;color:#7A2021;">#%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Teléfono / WhatsApp:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Domicilio en Temperley:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
		</table>

		<p style="font-size:12px;color:#7A6A5C;">Puedes consultar su expediente desde la pestaña <strong>Miembros y Perfiles</strong> del Backoffice.</p>
	`, readerName, readerEmail, memberNumber, phone, address)

	html := renderEmailLayout("Nuevo Lector Registrado", "Actualización del Padrón Parroquial", content)
	SendAsync(adminEmail, fmt.Sprintf("Nuevo Lector Registrado: %s (#%s)", readerName, memberNumber), html)
}

// 2. Notificación al Admin: Solicitud de Reserva de Libro
func SendReservationAdminEmail(adminEmail, readerName, readerEmail, bookTitle, author, reservationCode, pickupSlot string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Un lector ha solicitado la reserva de un ejemplar para retiro en mostrador:</p>
		
		<div style="background-color:#FAF8F5;border:1px solid #E5DCCF;border-left:4px solid #B8860B;border-radius:8px;padding:16px;margin:16px 0;">
			<span style="font-size:11px;font-family:sans-serif;text-transform:uppercase;color:#7A6A5C;font-weight:bold;display:block;">Código de Retiro</span>
			<span style="font-size:20px;font-family:monospace;font-weight:bold;color:#7A2021;">%s</span>
		</div>

		<table width="100%%" border="0" cellspacing="0" cellpadding="8" style="font-size:13px;border-collapse:collapse;margin:16px 0;background:#FAF8F5;border-radius:8px;">
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td width="35%%" style="font-weight:bold;color:#7A6A5C;">Título de la Obra:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Autoría:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Socio Lector:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Turno de Retiro:</td>
				<td style="color:#2B2118;">%s</td>
			</tr>
		</table>

		<p style="font-size:12px;color:#7A6A5C;">El ejemplar ya fue apartado temporalmente en el catálogo. Cuando el lector se presente, valida el código desde <strong>Circulación y Entregas</strong>.</p>
	`, reservationCode, bookTitle, author, readerName, readerEmail, pickupSlot)

	html := renderEmailLayout("Nueva Reserva de Libro", "Pase pendiente de entrega en el atrio", content)
	SendAsync(adminEmail, fmt.Sprintf("Nueva Reserva: \"%s\" (Lector: %s)", bookTitle, readerName), html)
}

// 2b. Confirmación al Lector de su Reserva
func SendReservationReaderEmail(readerName, readerEmail, bookTitle, author, reservationCode, pickupSlot string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Estimado/a <strong>%s</strong>:</p>
		<p>Tu solicitud de reserva para la obra <strong>"%s"</strong> de <em>%s</em> ha sido confirmada con éxito.</p>
		
		<div style="background-color:#FAF8F5;border:1px solid #E5DCCF;border-left:4px solid #B8860B;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
			<span style="font-size:11px;font-family:sans-serif;text-transform:uppercase;color:#7A6A5C;font-weight:bold;display:block;">Tu Código de Retiro</span>
			<span style="font-size:24px;font-family:monospace;font-weight:bold;color:#7A2021;letter-spacing:1px;">%s</span>
			<p style="margin:8px 0 0 0;font-size:12px;color:#554433;">Turno preferente: <strong>%s</strong></p>
		</div>

		<p style="font-size:13px;">Dispones de <strong>48 horas</strong> para retirar tu ejemplar por la secretaría parroquial (Sigmund Freud 201, Temperley). Al llegar, solo debes mostrar este código o tu pase QR digital.</p>
	`, readerName, bookTitle, author, reservationCode, pickupSlot)

	html := renderEmailLayout("Reserva Confirmada con Éxito", "Tu ejemplar ya está apartado en el atrio", content)
	SendAsync(readerEmail, fmt.Sprintf("Reserva Confirmada: \"%s\" - Código #%s", bookTitle, reservationCode), html)
}

// 3. Notificación: Retiro de Libro / Préstamo Activo (Para el Lector)
func SendLoanDeliveredReaderEmail(readerName, readerEmail, bookTitle, author, dueDateStr string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Estimado/a <strong>%s</strong>:</p>
		<p>Confirmamos que has retirado en mano el ejemplar <strong>"%s"</strong> de <em>%s</em>.</p>
		
		<div style="background-color:#FAF8F5;border:1px solid #E5DCCF;border-left:4px solid #15803D;border-radius:8px;padding:16px;margin:20px 0;">
			<span style="font-size:11px;font-family:sans-serif;text-transform:uppercase;color:#15803D;font-weight:bold;display:block;">Fecha Límite de Devolución</span>
			<span style="font-size:20px;font-weight:bold;color:#1B4332;">%s</span>
			<p style="margin:6px 0 0 0;font-size:12px;color:#554433;">Plazo reglamentario de 21 días. Puedes solicitar una prórroga desde el portal si necesitas más tiempo.</p>
		</div>

		<p style="font-size:13px;">¡Que disfrutes mucho de tu lectura comunitaria!</p>
	`, readerName, bookTitle, author, dueDateStr)

	html := renderEmailLayout("Préstamo Activo Confirmado", "Comienza tu período de lectura por 21 días", content)
	SendAsync(readerEmail, fmt.Sprintf("Préstamo Confirmado: \"%s\" (Vence: %s)", bookTitle, dueDateStr), html)
}

// 3b. Notificación: Retiro de Libro (Para el Admin)
func SendLoanDeliveredAdminEmail(adminEmail, readerName, readerEmail, bookTitle, dueDateStr string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Se ha completado la entrega física de un ejemplar en el mostrador parroquial:</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="8" style="font-size:13px;border-collapse:collapse;margin:16px 0;background:#FAF8F5;border-radius:8px;">
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td width="35%%" style="font-weight:bold;color:#7A6A5C;">Libro Retirado:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Entregado a:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Fecha de Vencimiento:</td>
				<td style="font-weight:bold;color:#7A2021;">%s</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Estado:</td>
				<td style="color:#15803D;font-weight:bold;">EN_CURSO (21 Días)</td>
			</tr>
		</table>
	`, bookTitle, readerName, readerEmail, dueDateStr)

	html := renderEmailLayout("Ejemplar Retirado en Mostrador", "Nuevo Préstamo Activo en Circulación", content)
	SendAsync(adminEmail, fmt.Sprintf("Retiro Confirmado: \"%s\" a %s", bookTitle, readerName), html)
}

// 4. Notificación: Devolución de Libro (Para el Lector)
func SendLoanReturnedReaderEmail(readerName, readerEmail, bookTitle string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Estimado/a <strong>%s</strong>:</p>
		<p>Te confirmamos que hemos recibido la devolución del ejemplar <strong>"%s"</strong> en la Capilla Nuestra Señora de Lourdes.</p>
		
		<div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;border-radius:8px;padding:16px;margin:20px 0;">
			<span style="font-size:12px;font-weight:bold;color:#166534;display:block;">Estado del Préstamo: COMPLETADO / DEVUELTO</span>
			<p style="margin:4px 0 0 0;font-size:12px;color:#14532D;">El libro ha retornado al catálogo parroquial para que otros vecinos puedan disfrutarlo.</p>
		</div>

		<p style="font-size:13px;">¡Muchas gracias por cuidar el patrimonio literario de nuestra comunidad! Te esperamos pronto para tu próxima lectura.</p>
	`, readerName, bookTitle)

	html := renderEmailLayout("Devolución Registrada con Éxito", "Tu préstamo ha quedado cerrado sin pendientes", content)
	SendAsync(readerEmail, fmt.Sprintf("Devolución Confirmada: \"%s\" - Biblioteca San Tito Brandsma", bookTitle), html)
}

// 4b. Notificación: Devolución de Libro (Para el Admin)
func SendLoanReturnedAdminEmail(adminEmail, readerName, readerEmail, bookTitle string) {
	content := fmt.Sprintf(`
		<p style="font-size:15px;margin-top:0;">Se ha registrado la recepción de una devolución física en el atrio:</p>
		
		<table width="100%%" border="0" cellspacing="0" cellpadding="8" style="font-size:13px;border-collapse:collapse;margin:16px 0;background:#FAF8F5;border-radius:8px;">
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td width="35%%" style="font-weight:bold;color:#7A6A5C;">Libro Devuelto:</td>
				<td style="font-weight:bold;color:#2B2118;">%s</td>
			</tr>
			<tr style="border-bottom:1px solid #E5DCCF;">
				<td style="font-weight:bold;color:#7A6A5C;">Lector que Devolvió:</td>
				<td style="color:#2B2118;">%s (%s)</td>
			</tr>
			<tr>
				<td style="font-weight:bold;color:#7A6A5C;">Stock Restaurado:</td>
				<td style="color:#15803D;font-weight:bold;">+1 Copia disponible en inventario</td>
			</tr>
		</table>
	`, bookTitle, readerName, readerEmail)

	html := renderEmailLayout("Devolución Recibida en Mostrador", "Reingreso de Ejemplar al Inventario", content)
	SendAsync(adminEmail, fmt.Sprintf("Devolución Recibida: \"%s\" por %s", bookTitle, readerName), html)
}
