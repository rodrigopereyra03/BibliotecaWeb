import fs from 'fs';
import path from 'path';

const steps = [
  { step: 202, name: 'catalogo_mobile.html' },
  { step: 204, name: 'mis_reservas_mobile.html' },
  { step: 206, name: 'confirmacion_pase_qr_mobile.html' },
  { step: 208, name: 'historial_mobile.html' },
  { step: 210, name: 'inicio_sesion_mobile.html' },
  { step: 212, name: 'noticias_mobile.html' },
  { step: 214, name: 'registro_mobile.html' }
];

const basePath = 'C:/Users/Usuario/.gemini/antigravity/brain/663e810b-7366-4440-af89-e182157ab17b/.system_generated/steps';
const outDir = 'stitch_assets/mobile';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

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
