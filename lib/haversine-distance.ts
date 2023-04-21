/**
 * Calculates the `Haversine Distance` between two points on the Earth's surface
 * using the `Haversine formula`.
 *
 * @param coord1 - The first set of coordinates, in the form [longitude, latitude].
 * @param coord2 - The second set of coordinates, in the form [longitude, latitude].
 * @returns The distance between the two sets of coordinates in kilometers, rounded to three decimal places.
 *
 * The haversine function takes in two arguments: the latitude and longitude coordinates of two points on the Earth's surface.
 * It calculates the distance between the two points using the Haversine formula and returns the result in kilometers.
 *
 * # Haversine Formula
 *
 * The Haversine Formula is a fundamental equation used to calculate distances on a sphere.
 * It derives its name from the Haversine function, which is defined as:
 * ```
 * haversine(θ) = sin²(θ/2)
 * ```
 * Here, `θ` represents an angle between two points on the sphere.
 *
 * When calculating distances between two points on a sphere, such as the Earth,
 * it takes into account the latitude and longitude coordinates of the points,
 * and requires angles to be in radians for trigonometric functions.
 * The formula is as follows:
 * ```
 * a = sin²((latB - latA)/2) + cos(latA) * cos(latB) * sin²((lonB - lonA)/2)
 * c = 2 * atan2(√a, √(1−a))
 * d = R * c
 * ```
 * where
 * - `latA` and `latB` are the latitudes of the two points in radians
 * - `lonA` and `lonB` are the longitudes of the two points in radians
 * - `R` is the Earth's radius in kilometers
 * - `d` is the distance between the two points in kilometers
 *
 * # Example usage
 *
 * ```
 * const lat1 = 37.7749; // San Francisco, California
 * const lon1 = -122.4194;
 * const lat2 = 40.7128; // New York City, New York
 * const lon2 = -74.006;
 *
 * const distance = haversine([lat1, lon1], [lat2, lon2]);
 * console.log(`Distance: ${distance} km`);
 * ```
 */
export function haversine<T extends number>(
  coord1: [T, T],
  coord2: [T, T]
): number {
  const R = 6_371_000; // radius of `Earth` in meters.

  const [lon1, lat1] = coord1.map(toRadians);
  const [lon2, lat2] = coord2.map(toRadians);
  const delta_lat = lat2 - lat1;
  const delta_lon = lon2 - lon1;

  const a =
    Math.sin(delta_lat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(delta_lon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance_km = (R * c) / 1000;

  return round(distance_km, 3);
}

/**
 * Converts an angle from degrees to radians.
 * @param degrees - The angle in degrees.
 * @returns The angle converted to radians.
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180.0;
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param num - The number to round.
 * @param decimalPlaces - The number of decimal places to round to.
 * @returns The rounded number.
 */
export function round(num: number, decimalPlaces: number): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(num * factor) / factor;
}

// const [lon1, lat1] = coord1; const [lon2, lat2] = coord2;
// const phi_1 = toRadians(lat1); const phi_2 = toRadians(lat2);
// const delta_phi = toRadians(lat2 - lat1); const delta_lambda = toRadians(lon2 - lon1);
// const a = Math.sin(delta_phi / 2.0) ** 2 + Math.cos(phi_1) * Math.cos(phi_2) * Math.sin(delta_lambda / 2.0) ** 2;
// const meters = R * c; // output distance in meters
// const km = meters / 1000.0; // output distance in kilometers
// return round(km, 3); // const _roundedMeters = round(meters, 3);

// export function haversine( lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);
//
//   const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
//
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//
//   return R * c;
// }
