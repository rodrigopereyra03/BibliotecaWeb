import fs from 'fs';
import path from 'path';

const steps = [
  { step: 257, name: 'dashboard.html' },
  { step: 259, name: 'inventory.html' },
  { step: 261, name: 'members.html' },
  { step: 263, name: 'circulation.html' },
  { step: 265, name: 'communications.html' },
  { step: 267, name: 'settings.html' }
];

const basePath = 'C:/Users/Usuario/.gemini/antigravity/brain/663e810b-7366-4440-af89-e182157ab17b/.system_generated/steps';
const outDir = 'stitch_assets/backoffice';

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
