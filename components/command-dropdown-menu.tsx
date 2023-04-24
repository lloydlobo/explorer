"use client";

import * as React from "react";
import { Calendar, MoreHorizontal, Tags, Trash, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

export function CommandDropdownMenu() {
  const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (query.length > 0) {
      setOpen(true);
    }

    return () => {
      setOpen(false);
    };
  }, [setOpen, query]);

  return (
    <Command>
      <CommandInput
        value={query}
        onValueChange={(value: string) => {
          setQuery(value);
        }}
        placeholder="Search a country"
        autoFocus={true}
      />
      <CommandList hidden={!open} inputMode="search">
        <CommandEmpty>No label found.</CommandEmpty>
        <CommandGroup>
          {labels.map((label) => (
            <CommandItem
              key={label}
              onSelect={(value) => {
                setLabel(value);
                setOpen(false);
              }}
            >
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
