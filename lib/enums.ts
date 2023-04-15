// Keep in mind that string enum members do not get a reverse mapping generated at all.
// [Source](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings)
//
// NOTE: Keep the exact spelling for enum values of each member, and in lowercase for value.

export enum ViewType {
  Default = "default",
  Cards = "cards",
  Table = "table",
}

export enum Region {
  All = "all",
  Africa = "africa",
  Americas = "americas",
  Asia = "asia",
  Europe = "europe",
  Oceania = "oceania",
}
