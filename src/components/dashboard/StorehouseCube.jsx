/** Storehouse Cube — decorative isometric visual, ported from the Expo
 *  rebuild's HomeScreen.tsx (a flat 3-polygon cube). Recolored from that
 *  app's light "Royal Gold" palette to this app's own brand system
 *  (teal gradient top face, navy side faces) — the palette itself is not
 *  ported, only the visual idea. Purely decorative, no data behind it. */
export default function StorehouseCube() {
  return (
    <div className="flex justify-center py-1">
      <svg width="100%" height="140" viewBox="0 0 300 260" className="max-w-[220px]">
        <defs>
          <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4C56A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#14B8A6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#172238" />
            <stop offset="1" stopColor="#0E1626" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D9488" stopOpacity="0.4" />
            <stop offset="1" stopColor="#111C30" />
          </linearGradient>
        </defs>
        <polygon points="150,20 250,75 150,130 50,75" fill="url(#cubeTop)" stroke="#14B8A6" strokeWidth="1.5" strokeOpacity="0.6" />
        <polygon points="50,75 150,130 150,230 50,175" fill="url(#cubeLeft)" stroke="#1F2A40" strokeWidth="1.5" />
        <polygon points="150,130 250,75 250,175 150,230" fill="url(#cubeRight)" stroke="#1F2A40" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
