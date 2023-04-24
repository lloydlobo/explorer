import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ResultsPerPage } from "@/lib/enums";

type SelectResultsPerPageProps = {
  selectedValue: string;
  handleSelectResultsPerPage: (value: string) => void;
};

export function SelectResultsPerPage({
  selectedValue,
  handleSelectResultsPerPage,
}: SelectResultsPerPageProps) {
  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => handleSelectResultsPerPage(value)}
    >
      <SelectTrigger
        title="Select results per page to view"
        className="w-[180px]"
      >
        <SelectValue placeholder="Select results per page" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ResultsPerPage.Ten.toString()}>
          <span className="capitalize">{ResultsPerPage.Ten}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.Twenty.toString()}>
          <span className="capitalize">{ResultsPerPage.Ten}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.Fifty.toString()}>
          <span className="capitalize">{ResultsPerPage.Fifty}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.OneHundred.toString()}>
          <span className="capitalize">{ResultsPerPage.OneHundred}</span>
        </SelectItem>
        <SelectItem value={ResultsPerPage.FiveHundred.toString()}>
          <span className="capitalize">
            {ResultsPerPage.FiveHundred && "All"}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
