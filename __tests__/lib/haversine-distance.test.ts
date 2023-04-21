import { haversine } from "@/lib/haversine-distance";

// (alias) function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number
// import haversine
// Calculates the distance between two points on the Earth's surface using the Haversine formula.
//
// The haversine function takes in four arguments: the latitude and longitude coordinates of two points on the Earth's surface. It calculates the distance between the two points using the Haversine formula and returns the result in kilometers.

describe("haversine distance calculation", () => {
  const mockHaversine = jest.fn(
    (lat1: number, lon1: number, lat2: number, lon2: number) =>
      haversine(lat1, lon1, lat2, lon2)
  );

  test("calculates distance when called with valid coordinates", () => {
    const haversineDistance = mockHaversine(10, 20, 30, 40);
    expect(mockHaversine).toHaveBeenCalledWith(10, 20, 30, 40);
    expect(haversineDistance).not.toBeNaN();
  });

  test("returns a distance greater than 0 for different lat lon", () => {
    const distance = haversine(0, 0, 10, 10);
    expect(distance).toBeGreaterThan(0);
  });

  // Fiji flag Distance from Australia to Fiji is: 9,074 kilometer
  //Guam flag Distance from Australia to Guam is: 4,025 kilometer
  // australia "latlng": [-27, 133],
  // fiji "latlng": [-18, 175],
  // guam "latlng": [13.46666666, 144.78333333],
  test("returns expected distance for known coordinates", () => {
    const distance = haversine(52.520008, 13.404954, 51.507222, -0.127647);
    expect(distance).toBeCloseTo(931.5601823699717, 1); // Expected: 934.4 Received: 931.5601823699717

    const australia = { name: "Australia", latlng: [-27, 133] };
    const fiji = { name: "Fiji", latlng: [-18, 175] };
    const guam = { name: "Guam", latlng: [13.46666666, 144.78333333] };

    const australiaToFijiDistance = 9074;
    const australiaToGuamDistance = 4025;

    expect(
      haversine(
        australia.latlng[0],
        australia.latlng[1],
        guam.latlng[0],
        guam.latlng[1]
      )
    ).toBeCloseTo(australiaToGuamDistance, -100);

    expect(
      haversine(
        australia.latlng[0],
        australia.latlng[1],
        fiji.latlng[0],
        fiji.latlng[1]
      )
    ).toBeCloseTo(australiaToFijiDistance, -100);

    const countries = new Set([australia, fiji, guam]);

    const distances = new Map();
    distances.set(`${australia.name}-${fiji.name}`, australiaToFijiDistance);
    distances.set(`${australia.name}-${guam.name}`, australiaToGuamDistance);
  });

  test("returns expected distance for known coordinates", () => {
    // Define the coordinates
    const sydney = { latitude: -33.865143, longitude: 151.2099 };
    const london = { latitude: 51.5074, longitude: -0.1278 };
    const fiji = { latitude: -18, longitude: 175 };
    const guam = { latitude: 13.46666666, longitude: 144.78333333 };

    // Define the expected distances
    const sydneyToLondonDistance = 17039;
    const sydneyToFijiDistance = 4747;
    const sydneyToGuamDistance = 7975;

    // Calculate the distances and compare them to the expected values
    expect(
      haversine(
        sydney.latitude,
        sydney.longitude,
        london.latitude,
        london.longitude
      )
    ).toBeCloseTo(sydneyToLondonDistance, -100);
    expect(
      haversine(
        sydney.latitude,
        sydney.longitude,
        fiji.latitude,
        fiji.longitude
      )
    ).toBeCloseTo(sydneyToFijiDistance, -100);
    expect(
      haversine(
        sydney.latitude,
        sydney.longitude,
        guam.latitude,
        guam.longitude
      )
    ).toBeCloseTo(sydneyToGuamDistance, -100);
  });

  test("returns 0 when all latitude and longitude are 0", () => {
    expect(haversine(0, 0, 0, 0)).toBe(0);
  });

  describe("when the same latitude and longitude is passed in", () => {
    test("returns 0 as distance", () => {
      const range = 100;
      const randomLat = Math.floor(Math.random() * range);
      const randomLon = Math.floor(Math.random() * range);

      for (let i = -1 * range; i < range; i++) {
        const [lat1, lon1] = [i * randomLat, i * randomLon];
        const [lat2, lon2] = [i * randomLat, i * randomLon];
        expect(haversine(lat1, lon1, lat2, lon2)).toBe(0);
      }
    });
  });

  // describe("when reading data from a file", () => {
  //   test("calculates distance correctly for each pair of coordinates", () => {
  //     const fs = require("fs");
  //     const path = require("path");
  //     const filePath = path.join(__dirname, "@/lib/data.json");
  //     const fileContent = fs.readFileSync(filePath, "utf-8");
  //     const coordinates = fileContent.split("\n");

  //     coordinates.forEach((coordinate) => {
  //       const [lat1, lon1, lat2, lon2] = coordinate.split(",");
  //       const distance = haversine(
  //         parseFloat(lat1),
  //         parseFloat(lon1),
  //         parseFloat(lat2),
  //         parseFloat(lon2)
  //       );
  //       expect(distance).toBeGreaterThan(0);
  //     });
  //   });
  // });
});

/* After you created the mock function using jest.fn, try to do console.log(fA.funcA.mock) and you will see the following outcome.

Jest Mocking Object

Whenever you called funcA, a new array will be created and push into calls. Thus, after you executed funcB(), you will be able to see there is new array inserted into calls array. */
