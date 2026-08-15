export const CITIES: string[] = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Lyon: { lat: 45.764, lng: 4.8357 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Toulouse: { lat: 43.6047, lng: 1.4442 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Nantes: { lat: 47.2184, lng: -1.5536 },
  Strasbourg: { lat: 48.5734, lng: 7.7521 },
  Montpellier: { lat: 43.6108, lng: 3.8767 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  Lille: { lat: 50.6292, lng: 3.0573 },
  Rennes: { lat: 48.1173, lng: -1.6778 },
};

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function nearestCity(lat: number, lng: number): string {
  let best = CITIES[0];
  let bestDist = Infinity;
  for (const city of CITIES) {
    const d = haversineKm({ lat, lng }, CITY_COORDS[city]);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}
