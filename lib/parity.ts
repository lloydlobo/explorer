/**
 * Calculates the conversion parity price (CPP) for a given convertible security.
 *
 * @param {number} vcs - The value of the convertible security ($).
 * @param {number} cr - The conversion ratio.
 * @returns {number} The conversion parity price ($).
 * @throws {Error} Throws an error if either input is not a number or if the conversion ratio is zero.
 *
 * [See](https://calculator.academy/conversion-parity-price-calculator/)
 */
// The calculateCPP function takes in two parameters: vcs (value of the convertible security) and cr (conversion ratio). It returns the conversion parity price as a number.
//
// The function first checks if both vcs and cr are numbers and if the cr is not zero. If either of these conditions is not met, it throws an error with a message explaining the issue.
//
// If both inputs are valid, the function calculates the conversion parity price by dividing the vcs by the cr and returns the result.
//
// Here's an example of how to use the function:
//
// Calculate the conversion parity price for a convertible security with a value of $10,000 and a conversion ratio of 200.
// const cpp = calculateCPP(10000, 200);
// console.log(cpp); // Output: 50
function calculateCPP(vcs: number, cr: number): number {
  if (typeof vcs !== "number" || typeof cr !== "number" || cr === 0) {
    throw new Error(
      "Invalid input. Both arguments must be numbers and the conversion ratio cannot be zero."
    );
  }

  return vcs / cr;
}

// The function takes in a ParityPrices object which represents the prices for each country, and a relativePercentage number which represents the percentage by which to adjust the prices. The function returns a new ParityPrices object with the adjusted prices for each country.
//
// The function assumes that the default currency is USD (1 USD = 1 USD) and adjusts the prices for all other countries relative to the USD price. If you want to use a different base currency, you can specify it as the third argument to the function.
interface ParityPrices {
  [countryCode: string]: number;
}

function calculateParityPrices(
  prices: ParityPrices,
  relativePercentage: number,
  baseCurrency: string = "USD"
): ParityPrices {
  const parityPrices: ParityPrices = {};
  const basePrice = prices[baseCurrency];
  for (const [countryCode, price] of Object.entries(prices)) {
    if (countryCode === baseCurrency) {
      parityPrices[countryCode] = price;
    } else {
      const parityPrice = (basePrice * (1 + relativePercentage / 100)) / price;
      parityPrices[countryCode] = Math.round(parityPrice * 100) / 100;
    }
  }
  return parityPrices;
}
// There isn't a universally agreed-upon way to assign these values, as different factors can be considered fair or relevant depending on the context. Some possible approaches to assigning parity values could include:
//
//     Using purchasing power parity (PPP), which compares the relative value of different currencies by looking at the cost of a basket of goods across countries.
//     Using exchange rates, which can be influenced by a range of economic and political factors.
//     Adjusting for inflation or deflation, to account for changes in the value of currencies over time.
//     Considering the relative cost of living in different countries, as reflected in metrics like the Consumer Price Index.
//
// Ultimately, the best approach will depend on the specific goals and priorities of the project or organization involved.

interface CountryPrice {
  country: string;
  code: string;
  gdp: number;
  percentage: number;
  overridePrice?: number;
}

const prices: CountryPrice[] = [
  { country: "United States", code: "USD", gdp: 21.44, percentage: 1 },
  { country: "Germany", code: "EUR", gdp: 3.95, percentage: 0.33 },
  { country: "Japan", code: "JPY", gdp: 1.63, percentage: 0.09 },
  { country: "United Kingdom", code: "GBP", gdp: 2.62, percentage: 0.15 },
  { country: "China", code: "CNY", gdp: 15.42, percentage: 0.84 },
  { country: "India", code: "INR", gdp: 2.94, percentage: 0.13 },
  // ... other countries
];

// CountryPrice interface is defined with the country name, currency code, GDP value, assigned percentage, and an optional override price. The prices array contains data for several countries, each with their respective values for these properties.
//
// The getParityPrice function takes in a countryCode parameter and finds the matching country data from the prices array. It checks for an override price first and returns that if it exists. Otherwise, it calculates the parity price based on the GDP value, assigned percentage, and a factor of 100.
function getParityPrice(countryCode: string): number {
  const country = prices.find((c) => c.code === countryCode);

  if (!country) {
    throw new Error(`No data found for country code '${countryCode}'`);
  }

  if (country.overridePrice) {
    return country.overridePrice;
  }

  return country.gdp * country.percentage * 100;
}
