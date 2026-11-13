import fs from 'fs';
import path from 'path';

const steps = [
  { step: 68, name: 'catalogo.html' },
  { step: 72, name: 'mis_reservas.html' },
  { step: 74, name: 'confirmacion_reserva.html' },
  { step: 76, name: 'historial_prestamos.html' },
  { step: 78, name: 'noticias_cartelera.html' },
  { step: 80, name: 'inicio_sesion.html' },
  { step: 82, name: 'registro.html' }
];

const basePath = 'C:/Users/Usuario/.gemini/antigravity/brain/663e810b-7366-4440-af89-e182157ab17b/.system_generated/steps';
const outDir = 'stitch_assets';

for (const { step, name } of steps) {
  const filePath = path.join(basePath, String(step), 'output.txt');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(raw);
      if (data.html) {
        fs.writeFileSync(path.join(outDir, name), data.html, 'utf8');
        console.log(`Saved ${name} (${data.html.length} bytes)`);
      } else {
        console.warn(`No html property in step ${step}`);
      }
    } catch (e) {
      console.error(`Error parsing JSON for step ${step}:`, e.message);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}
