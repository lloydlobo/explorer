const R = 6371.0; // Radius of the Earth in kilometers

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Calculates the distance between two points on the Earth's surface
 * using the `Haversine formula`.
 *
 * The haversine function takes in four arguments:
 * the latitude and longitude coordinates of two points on the Earth's surface. It calculates the distance between the two points using the Haversine formula and returns the result in kilometers.
 *
 * # Example usage
 *
 * const lat1 = 37.7749; // San Francisco, California
 * const lon1 = -122.4194;
 * const lat2 = 40.7128; // New York City, New York
 * const lon2 = -74.006;
 *
 * const distance = haversine(lat1, lon1, lat2, lon2);
 * console.log(`Distance: ${distance} km`);
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.pow(Math.sin(dLon / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
