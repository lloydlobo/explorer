import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewType } from "@/lib/enums";

import React from "react";

type SelectViewProps = {
  // typescript: Type 'string' is not assignable to type 'ViewType'.
  selectedView: string | ViewType; // TODO: how to typecheck the values. ZOD?
  handleSelectView: (value: string) => void;
};

/** Get the selected country and region from the global store.*/
export function SelectView({
  selectedView,
  handleSelectView,
}: SelectViewProps): JSX.Element {
  return (
    <Select
      value={selectedView}
      onValueChange={(value) => handleSelectView(value)}
    >
      <SelectTrigger title="Select layout view" className="w-[180px]">
        <SelectValue placeholder="Select View" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ViewType.Default}>
          <span className="capitalize">{ViewType.Default}</span>
        </SelectItem>
        <SelectItem value={ViewType.Cards}>
          <span className="capitalize">{ViewType.Cards}</span>
        </SelectItem>
        <SelectItem value={ViewType.Table}>
          <span className="capitalize">{ViewType.Table}</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
