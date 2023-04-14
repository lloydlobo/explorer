import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

type SelectRegionProps = {
  selectedRegion: string;
  handleRegionSelect: (value: string) => void;
};

/** Get the selected country and region from the global store.*/
export default function SelectRegion({
  selectedRegion,
  handleRegionSelect,
}: SelectRegionProps): JSX.Element {
  // const state = useCountryStore();
  // const { selectedRegion, setSelectedRegion } = state;
  //
  // // Handle selection of a region.
  // const handleRegionSelect = (e: React.FormEvent<HTMLButtonElement>) => {
  //   setSelectedRegion(e.currentTarget.value);
  // };
  return (
    <Select
      value={selectedRegion}
      onValueChange={(value) => handleRegionSelect(value)}
    >
      <SelectTrigger title="Filter by region" className="w-[180px]">
        <SelectValue placeholder="Filter by region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="Africa">Africa</SelectItem>
        <SelectItem value="Americas">Americas</SelectItem>
        <SelectItem value="Asia">Asia</SelectItem>
        <SelectItem value="Europe">Europe</SelectItem>
        <SelectItem value="Oceania">Oceania</SelectItem>
      </SelectContent>
    </Select>
  );
}
