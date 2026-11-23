// Lets the timer be installed as its own app ("Minuteur Spar"), separate from the main Spar app.
export function GET() {
  const manifest = {
    name: "Minuteur Spar, minuteur de boxe",
    short_name: "Minuteur",
    description: "Minuteur de rounds pour la boxe et le sparring, gratuit, sans compte.",
    lang: "fr",
    start_url: "/minuteur",
    scope: "/minuteur",
    display: "standalone",
    orientation: "any",
    background_color: "#070707",
    theme_color: "#070707",
    categories: ["sports", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
