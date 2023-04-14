import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Indicator } from "@/components/ui/indicator";

// Component that renders a single country as a card in a grid
type CountryCardProps = {
  country: ICountry;
};

export function CountryCard({ country }: CountryCardProps) {
  const { selectedCountry, setSelectedCountry } = useCountryStore();
  // Handle click on a country link.
  const handleCountryClick = (alpha3Code: string) => {
    setSelectedCountry(alpha3Code);
  };
  return (
    <Card
      padding="none"
      paddingBody="p-4"
      linkHref={`/countries/${country.alpha3Code}`}
      // action={
      //   <Button variant={"ghost"} className="ms-auto">
      //     Click Me
      //   </Button>
      // }
      onClick={(_e) => handleCountryClick(country.alpha3Code)}
      isActive={selectedCountry === country.alpha3Code}
      activeIndicator={
        <div className="absolute -top-2 right-3">
          <Indicator />
        </div>
      }
      title={country.name}
      description={
        <div className="grid stats">
          <div className="flex gap-2 stat">
            <div className="font-bold">Population</div>
            <div className="">{country.population}</div>
          </div>
          <div className="flex gap-2 stat">
            <div className="font-bold">Capital</div>
            <div className="">{country.capital}</div>
          </div>
        </div>
      }
      imageUrl={country.flag}
      imageAlt={`Flag of ${country.name}`}
    />
  );
}
