import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICountry } from "@/lib/types/types-country";
import { CountryBorders } from "@/components/country/country-borders";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { CopyIcon } from "lucide-react";

interface CountryDetailProps {
  country: ICountry;
  borderCountries: ICountry[];
}

export function CountryDetail({
  country,
  borderCountries,
}: CountryDetailProps) {
  const { toast } = useToast();

  return (
    <Tabs defaultValue="detail" className="overflow-x-scroll min-w-[400px]">
      <TabsList>
        <TabsTrigger value="detail">Detail</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="detail">
        {country && (
          <>
            <Image
              width={180}
              height={140}
              alt={`${country.name ?? "country"} flag`}
              src={country.flag}
            />
            <p>Population: {country.population}</p>
            <p>Region: {country.region}</p>
            <p>Capital: {country.capital}</p>
          </>
        )}

        <section className="flex gap-2" aria-label="Borders">
          <h2 className="h2">Borders</h2>
          <CountryBorders borderCountries={borderCountries} country={country} />
        </section>
      </TabsContent>

      <TabsContent value="json">
        <Button
          className="absolute right-12"
          aria-label="Copy to clipboard"
          variant={"ghost"}
          size={"sm"}
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard({
              text: JSON.stringify(country, null, 2),
              onSuccess: () =>
                toast({
                  title: "Copied to clipboard",
                  description: "",
                }),
              onError: (error) =>
                toast({
                  title: "Failed to copy JSON to clipboard",
                  description: error.message,
                }),
            });
          }}
        >
          <CopyIcon />
        </Button>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          <pre>{JSON.stringify(country, null, 2)}</pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}
