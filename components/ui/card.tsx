import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { cn } from "@/lib/utils";
import Link from "next/link";

const cardVariants = cva(
  "bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700",
  {
    variants: {
      variant: {
        default: "",
        elevated:
          "border-transparent shadow-lg hover:shadow-xl dark:hover:shadow-2xl",
        outlined: "border-gray-400",
        dashed: "border-dashed",
      },
      padding: {
        default: "p-5",
        compact: "p-3",
        spacious: "p-7",
        none: "p-0",
      },
      imageVariant: {
        default: "",
        rounded: "rounded-t-lg",
        square: "",
        video: "aspect-video object-cover w-[450px]",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      imageVariant: "default",
    },
  }
);

export interface CardProps extends VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  linkHref?: string;
  paddingBody?: string;
  isActive?: boolean;
  activeIndicator?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      imageVariant,
      title,
      description,
      imageUrl,
      imageAlt,
      isActive,
      paddingBody,
      activeIndicator,
      linkHref,
      action,
      onClick,
      ...props
    },
    ref
  ) => {
    const clickableArea = (
      <div className="relative clickable-area">
        {isActive && <div className="relative z-10">{activeIndicator}</div>}
        {imageUrl && (
          <div>
            <AspectRatio ratio={16 / 9}>
              <Image
                className={cn(
                  `${imageVariant} rounded-md w-[450px] aspect-video object-cover`
                )}
                fill
                src={imageUrl}
                alt={imageAlt ?? ""}
              />
            </AspectRatio>
          </div>
        )}
        <div className={cn(paddingBody)}>
          {title && (
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h5>
          )}
          {description && (
            <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {description}
            </div>
          )}
          {action && <div className="flex relative w-full">{action}</div>}
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          onClick && onClick(e)
        }
        {...props}
      >
        {linkHref ? (
          <Link href={linkHref}>{clickableArea}</Link>
        ) : (
          clickableArea
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants };

/*
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(" flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
*/
