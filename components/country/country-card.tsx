import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Indicator } from "@/components/ui/indicator";
import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";

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
    <Link
      href={`/countries/${country.alpha3Code}`}
      onClick={handleCountryClick.bind(null, country.alpha3Code)}
    >
      <div className="relative">
        {selectedCountry === country.alpha3Code ? (
          <div className="absolute -top-2 right-3">
            <Indicator />
          </div>
        ) : null}
      </div>
      <Card>
        <AspectRatio ratio={16 / 9}>
          <img
            src={country.flag}
            alt={`Flag of ${country.name}`}
            className="object-cover rounded-md opacity-90 hover:opacity-100 w-[600px] md:w-[450px] aspect-video"
          />
        </AspectRatio>
        <CardHeader>
          <CardTitle>{country.name}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid stats">
            <div className="flex gap-2 stat">
              <div className="font-bold">Population</div>
              <div className="">{country.population}</div>
            </div>
            <div className="flex gap-2 stat">
              <div className="font-bold">Capital</div>
              <div className="">{country.capital}</div>
            </div>
            <div className="flex gap-2 stat">
              <div className="font-bold">TLD</div>
              {/* <div className="text-xs!">{country.timezones.join(" ")}</div> */}
              <div className="text-xs!">{country.topLevelDomain.join(" ")}</div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
      </Card>
    </Link>
    // <Card
    //   padding="none"
    //   paddingBody="p-4"
    //   linkHref={`/countries/${country.alpha3Code}`}
    //   // action={
    //   //   <Button variant={"ghost"} className="ms-auto">
    //   //     Click Me
    //   //   </Button>
    //   // }
    //   onClick={(_e) => handleCountryClick(country.alpha3Code)}
    //   isActive={selectedCountry === country.alpha3Code}
    //   activeIndicator={
    //     <div className="absolute -top-2 right-3">
    //       <Indicator />
    //     </div>
    //   }
    //   title={country.name}
    //   description={
    //     <div className="grid stats">
    //       <div className="flex gap-2 stat">
    //         <div className="font-bold">Population</div>
    //         <div className="">{country.population}</div>
    //       </div>
    //       <div className="flex gap-2 stat">
    //         <div className="font-bold">Capital</div>
    //         <div className="">{country.capital}</div>
    //       </div>
    //     </div>
    //   }
    //   imageUrl={country.flag}
    //   imageAlt={`Flag of ${country.name}`}
    // />
  );
}
