import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ClassProp } from "class-variance-authority/dist/types";
import * as React from "react";

//h1 "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
// <h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
//h3 mt-8 scroll-m-20 text-2xl font-semibold tracking-tight
//h4 mt-8 scroll-m-20 text-xl font-semibold tracking-tight
//p leading-7 [&:not(:first-child)]:mt-6
const headingVariants = cva(
  "",
  {
    variants: {
      variant: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-10",
        h2: "scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mt-8  ",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight mt-8 text-xl font-semibold tracking-tight",
        h4: "scroll-m-20",
      },
      color: {
        default: "text-slate-900 dark:text-slate-100",
        muted: "text-slate-500 dark:text-slate-400",
        accent: "text-indigo-600 dark:text-indigo-400",
      },
      fontWeight: {
        normal: "font-normal",
        bold: "font-bold",
      },
    },
    defaultVariants: { variant: "h3", color: "default", fontWeight: "bold", },
  }
);

interface HeadingProps extends VariantProps<typeof headingVariants> {
  variant?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children?: React.ReactNode;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ variant, color, fontWeight, className, children, ...props }, ref) => {
    const Variant = typeof <h1></h1>;
    return React.createElement(
      variant??"h3",
      {
        className: cn(
          headingVariants({
            variant,
            color,
            fontWeight,
            className,
          })
        ),
        ref,
        ...props,
      },
      children
    );
  }
);

Heading.displayName = "Heading";

export { Heading, headingVariants };

export function TypographyP() {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
    </p>
  );
}

export function TypographyBlockquote() {
  return (
    <blockquote className="mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200">
    </blockquote>
  );
}

export function TypographyTable() {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </th>
            <th className="border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
          </tr>
          <tr className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800">
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
          </tr>
          <tr className="m-0 border-t border-slate-200 p-0 even:bg-slate-100 dark:border-slate-600 dark:even:bg-slate-800">
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
            <td className="border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TypographyList() {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      <li></li>
      <li></li>
      <li></li>
    </ul>
  );
}

export function TypographyInlineCode() {
  return (
    <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400">
    </code>
  );
}

export function TypographyLead() {
  return (
    <p className="text-xl text-slate-700 dark:text-slate-400">
    </p>
  );
}

export function TypographyLarge() {
  return (
    <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
    </div>
  );
}

export function TypographySmall() {
  return (
    <small className="text-sm font-medium leading-none"></small>
  );
}

export function TypographySubtle() {
  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
    </p>
  );
}
