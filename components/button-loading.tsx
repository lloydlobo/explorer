import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({ label = "Please wait" }) {
  return (
    <Button disabled>
      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
      {label}
    </Button>
  );
}
