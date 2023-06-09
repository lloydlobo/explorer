import { ICountry } from "@/lib/types/types-country";
import { CountryTable } from "@/components/country/country-table";
import { CountryCard } from "@/components/country/country-card";
import { ViewType } from "@/lib/enums";

type CountryListProps = {
  countries: ICountry[];
  selectedView: ViewType;
};

// Component that renders either the table or the card grid based on a boolean prop
export function CountryList({ countries, selectedView }: CountryListProps) {
  switch (selectedView) {
    case ViewType.Table: {
      return (
        <CountryTable
          headerData={["Name", "Capital", "Population"]}
          keysToRender={["name", "capital", "population"]}
          tableData={countries}
        />
      );
    }
    case ViewType.Default:
    case ViewType.Cards: {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {countries.map((country, idxCountry) => (
            <CountryCard
              key={`country-card-${country.alpha3Code}-${idxCountry}`}
              country={country}
            />
          ))}
        </div>
      );
    }
    // TODO: Handle error.
    default: {
      return null;
    }
  }
}
