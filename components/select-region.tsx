import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Region } from "@/lib/enums";

import React from "react";

type SelectRegionProps = {
  selectedRegion: Region;
  handleRegionSelect: (value: Region) => void;
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
      // HACK: is it valid to cast select prop as Region here?
      onValueChange={(value) => handleRegionSelect(value as Region)}
    >
      <SelectTrigger title="Filter by region" className="w-[180px]">
        <SelectValue placeholder="Filter by region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Region.All}>{Region.All}</SelectItem>
        <SelectItem value={Region.Africa}> {Region.Africa}</SelectItem>
        <SelectItem value={Region.Americas}>{Region.Americas}</SelectItem>
        <SelectItem value={Region.Asia}> {Region.Asia}</SelectItem>
        <SelectItem value={Region.Europe}> {Region.Europe}</SelectItem>
        <SelectItem value={Region.Oceania}> {Region.Oceania}</SelectItem>
      </SelectContent>
    </Select>
  );
}
