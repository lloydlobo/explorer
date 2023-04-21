import { haversine, toRadians, round } from "@/lib/haversine-distance";

describe("haversine distance calculation", () => {
  describe("with valid coordinates", () => {
    test("calculates distance without throwing an error", () => {
      expect(haversine([10, 20], [30, 40])).not.toBeNaN();
    });

    test("returns distance greater than 0 for different lat lon", () => {
      expect(haversine([0, 0], [10, 10])).toBeGreaterThan(0);
    });

    test("haversine calculates the distance between two points correctly", () => {
      const point1: [number, number] = [-0.116773, 51.510357];
      const point2: [number, number] = [-77.009003, 38.889931];
      const expectedDistance = round(5_897_658.289 / 1000, 3); // meter rounded to km.

      const distance = haversine(point1, point2);

      expect(distance).toBeCloseTo(expectedDistance, -1);
    });

    test("returns 0 when all latitude and longitude are 0", () => {
      expect(haversine([0, 0], [0, 0])).toBe(0);
    });

    describe("when the same latitude and longitude is passed in", () => {
      test("returns 0 as distance", () => {
        const [lat, lon] = [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
        ];
        expect(haversine([lat, lon], [lat, lon])).toBe(0);
      });
    });
  });

  describe("with known coordinates", () => {
    test("returns expected distance for known coordinates", () => {
      expect(
        haversine([52.520008, 13.404954], [51.507222, -0.127647])
      ).toBeCloseTo(1508.889, 1);

      expect(haversine([-27, 133], [-18, 175])).toBeCloseTo(9074, -10);
      expect(haversine([-27, 133], [13.46666666, 144.78333333])).toBeCloseTo(
        4025,
        -10
      );
      expect(haversine([-18, 175], [13.46666666, 144.78333333])).toBeCloseTo(
        5433,
        -10
      );
    });
  });
});

describe("haversine distance calculation helpers", () => {
  describe("toRadians function", () => {
    test("converts degrees to radians", () => {
      expect(toRadians(0)).toBe(0);
      expect(toRadians(45)).toBeCloseTo(0.785398, 6);
      expect(toRadians(90)).toBeCloseTo(1.570796, 6);
      expect(toRadians(180)).toBeCloseTo(3.141593, 6);
      expect(toRadians(360)).toBeCloseTo(6.283185, 6);
    });
  });

  describe("round function", () => {
    test("rounds a number to a specified number of decimal places", () => {
      expect(round(0, 2)).toBe(0);
      expect(round(1.23456789, 0)).toBe(1);
      expect(round(1.23456789, 1)).toBeCloseTo(1.2, 6);
      expect(round(1.23456789, 2)).toBeCloseTo(1.23, 6);
      expect(round(1.23456789, 3)).toBeCloseTo(1.235, 6);
      expect(round(1.23456789, 6)).toBeCloseTo(1.234568, 6);
    });
  });
});
