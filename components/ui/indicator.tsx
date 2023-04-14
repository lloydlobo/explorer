// export function Indicator() {
//   return (
//     <div className="relative">
//       <span className="flex absolute -top-1 -right-2 justify-center items-center w-5 h-5 animate-bounce">
//         <span className="inline-flex absolute w-full h-full rounded-full opacity-75 animate-ping bg-sky-400" />
//         <span className="inline-flex relative w-3 h-3 rounded-full bg-sky-500" />
//       </span>
//     </div>
//   );
// }

import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const indicatorVariants = cva(
  "absolute flex items-center justify-center rounded-full w-5 h-5",
  {
    variants: {
      size: {
        default: "",
        sm: "w-4 h-4",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof indicatorVariants> { }

const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(indicatorVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <span className="inline-flex absolute w-full h-full rounded-full opacity-75 animate-ping bg-sky-400" />
        <span className="inline-flex relative w-3 h-3 rounded-full bg-sky-500" />
      </div>
    );
  }
);
Indicator.displayName = "Indicator";

export { Indicator, indicatorVariants };
