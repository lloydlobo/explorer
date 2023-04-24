// Keep in mind that string enum members do not get a reverse mapping generated at all.
// [Source](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings)
//
// NOTE: Keep the exact spelling for enum values of each member, and in lowercase for value.

// Used as a visual layout table type filter, to view entries(countries) as either cards or tables. Defautls to cards
export enum ViewType {
  Default = "default",
  Cards = "cards",
  Table = "table",
}

// used to filter countries from REST countries API by region
export enum Region {
  All = "all",
  Africa = "africa",
  Americas = "americas",
  Asia = "asia",
  Europe = "europe",
  Oceania = "oceania",
}

export enum ResultsPerPage {
  None = 0,
  Ten = 10,
  Twenty = 20,
  Fifty = 50,
  Hundred = 100,
  OneHundred = 100,
  FiveHundred = 500,
}

// Used with tanstack query.
export enum QueryKey {
  Countries = "countries",
}

export enum LocalStorageKey {
  GameState = "GameState",
  LastRoundTimestamp = "LastRoundTimestamp",
}
