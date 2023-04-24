import { Loader2 } from "lucide-react";
import React from "react";

export function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="sr-only">Loading...</div>
      <Loader2 className="mt-12 animate-spin" />
    </div>
  );
}
