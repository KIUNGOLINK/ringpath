import type { MetadataRoute } from "next";

// Makes Spar installable from the browser (iPhone "Sur l'écran d'accueil",
// Android "Installer l'application") and launches straight into the tool.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spar, trouve ton prochain sparring",
    short_name: "Spar",
    description: "Trouve un partenaire de sparring près de chez toi, gratuit.",
    lang: "fr",
    start_url: "/app/spar",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070707",
    theme_color: "#070707",
    categories: ["sports", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Trouver un sparring", url: "/app/spar/find" },
      { name: "Minuteur", url: "/minuteur" },
      { name: "Créer une session", url: "/app/spar/create" },
    ],
  };
}
