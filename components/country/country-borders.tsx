import { useCountryStore } from "@/lib/state/country-store";
import { ICountry } from "@/lib/types/types-country";
import Link from "next/link";
import React from "react";

type CountryBordersProps = {
  borderCountries: ICountry[];
  country: ICountry;
};

export function CountryBorders({
  borderCountries,
  country,
}: CountryBordersProps) {
  const { setSelectedCountry } = useCountryStore();

  // Handle click on a country link.
  const handleCountryClick = (alpha3Code: ICountry["alpha3Code"]) => {
    setSelectedCountry(alpha3Code);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {borderCountries.length > 0 ? (
        borderCountries.map((borderCountry, idx) => (
          <Link
            key={`border-${borderCountry.alpha3Code}-${idx}-${country.name}`}
            href={`/countries/${borderCountry.alpha3Code}`}
            data-code={borderCountry.alpha3Code}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
              handleCountryClick(
                e.currentTarget.dataset.code ?? borderCountry.alpha3Code
              )
            }
            className="p-2 min-w-max text-xs text-center rounded-lg border"
          >
            {borderCountry.name}
          </Link>
        ))
      ) : (
        <>N.A.</>
      )}
    </div>
  );
}
