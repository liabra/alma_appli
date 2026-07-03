export default function LogoAlma({ size = 200 }) {
  return (
    <svg viewBox="0 0 320 230" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="160" cy="128" r="96" fill="#F0D5C5" opacity="0.55" />
      <circle cx="160" cy="128" r="72" fill="#FFFAF6" opacity="0.7" />
      <path d="M 92 176 C 84 118, 118 62, 163 62 C 196 62, 220 84, 226 114" fill="none" stroke="#C4714A" strokeWidth="13" strokeLinecap="round" />
      <circle cx="163" cy="44" r="17" fill="#C4714A" />
      <path d="M 226 114 C 232 146, 212 176, 178 182 C 150 187, 122 178, 108 160" fill="none" stroke="#D4876A" strokeWidth="13" strokeLinecap="round" />
      <circle cx="138" cy="138" r="13" fill="#6B8F71" />
      <path d="M 138 152 C 152 156, 162 148, 166 138" fill="none" stroke="#6B8F71" strokeWidth="9" strokeLinecap="round" />
      <path d="M 236 210 C 246 200, 258 198, 268 202 C 262 212, 250 216, 236 210 Z" fill="#6B8F71" opacity="0.85" />
      <path d="M 232 226 C 240 218, 252 216, 262 220 C 256 230, 242 232, 232 226 Z" fill="#8FAE94" opacity="0.7" />
    </svg>
  );
}
