import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Illustration exacte du logo (paths de src/components/ui/LogoAlma.jsx, espace 320x230)
const ART = `
  <circle cx="160" cy="128" r="96" fill="#F0D5C5" opacity="0.55"/>
  <circle cx="160" cy="128" r="72" fill="#FFFAF6" opacity="0.7"/>
  <path d="M 92 176 C 84 118, 118 62, 163 62 C 196 62, 220 84, 226 114" fill="none" stroke="#C4714A" stroke-width="13" stroke-linecap="round"/>
  <circle cx="163" cy="44" r="17" fill="#C4714A"/>
  <path d="M 226 114 C 232 146, 212 176, 178 182 C 150 187, 122 178, 108 160" fill="none" stroke="#D4876A" stroke-width="13" stroke-linecap="round"/>
  <circle cx="138" cy="138" r="13" fill="#6B8F71"/>
  <path d="M 138 152 C 152 156, 162 148, 166 138" fill="none" stroke="#6B8F71" stroke-width="9" stroke-linecap="round"/>
  <path d="M 236 210 C 246 200, 258 198, 268 202 C 262 212, 250 216, 236 210 Z" fill="#6B8F71" opacity="0.85"/>
  <path d="M 232 226 C 240 218, 252 216, 262 220 C 256 230, 242 232, 232 226 Z" fill="#8FAE94" opacity="0.7"/>
`;

const ART_W = 320;
const ART_H = 230;
const BG = "#F5EDE3";

// SVG carré : fond plein + illustration centrée, occupant `frac` du côté (basé sur la largeur de l'art)
function buildSvg(size, frac) {
  const scale = (size * frac) / ART_W;
  const w = ART_W * scale;
  const h = ART_H * scale;
  const tx = (size - w) / 2;
  const ty = (size - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})">${ART}</g>
</svg>`;
}

const outDir = fileURLToPath(new URL("../public/icons/", import.meta.url));
mkdirSync(outDir, { recursive: true });

async function render(name, size, frac) {
  const svg = buildSvg(size, frac);
  await sharp(Buffer.from(svg)).png().toFile(outDir + name);
  console.log(`✓ ${name} (${size}x${size}, art ${Math.round(frac * 100)}%)`);
}

await render("alma-192.png", 192, 0.86);
await render("alma-512.png", 512, 0.86);
await render("alma-maskable-512.png", 512, 0.72); // zone de sécurité maskable
console.log("Icônes générées dans public/icons/");
