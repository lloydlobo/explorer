import { ICountry } from "@/lib/types/types-country";
import { CountryTable } from "@/components/country/country-table";
import { CountryCard } from "@/components/country/country-card";

type CountryListProps = {
  countries: ICountry[];
  isTable: boolean;
  setIsTable: React.Dispatch<React.SetStateAction<boolean>>;
};
// Component that renders either the table or the card grid based on a boolean prop
export function CountryList({
  countries,
  isTable,
  setIsTable,
}: CountryListProps) {
  return (
    <div className="container mx-auto">
      <button className="mb-4" onClick={() => setIsTable(!isTable)}>
        {isTable ? "Switch to Card View" : "Switch to Table View"}
      </button>
      {isTable ? (
        <CountryTable
          headerData={["Name", "Capital", "Population"]}
          keysToRender={["name", "capital", "population"]}
          tableData={countries}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {countries.map((country, idxCountry) => (
            <CountryCard
              key={`country-card-${country.alpha3Code}-${idxCountry}`}
              country={country}
            />
          ))}
        </div>
      )}
    </div>
  );
}
