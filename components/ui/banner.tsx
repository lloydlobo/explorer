import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useAppStore } from "@/lib/state/app-store";
import Image from "next/image";

export interface BannerProps extends VariantProps<typeof bannerVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  linkHref?: string;
  action?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}

const bannerVariants = cva(
  "bg-slate-800 rounded-xs shadow-sm overflow-hidden p-2",
  {
    variants: {
      type: {
        info: "border-l-4 border-slate-500",
        success: "border-l-4 border-green-500",
        warning: "border-l-4 border-yellow-500",
        danger: "border-l-4 border-red-500",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      type,
      title,
      description,
      imageUrl,
      imageAlt,
      linkHref,
      action,
      onClick,
      ...props
    },
    ref
  ) => {
    const { isOpenBanner, setIsOpenBannerToggle } = useAppStore();

    const image = imageUrl ? (
      <div>
        <Image src={imageUrl} alt={imageAlt ?? ""} width={16} height={16} />
      </div>
    ) : null;

    const titleContent = title ? (
      <div className="text-xs font-medium text-gray-100">{title}</div>
    ) : null;

    const descriptionContent = description ? (
      <div className="text-xs text-gray-300">{description}</div>
    ) : null;

    const actionContent = action ? <div className="mt-4">{action}</div> : null;

    // const bannerCloseStyles = cva(
    //   "pr-4 flex cursor-pointer text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
    // );

    const closeContent = (
      <Button
        // className={bannerCloseStyles()}
        className="rounded-full scale-[90%] h-4 invert"
        variant="link"
        size="sm"
        type="button"
        onClick={setIsOpenBannerToggle}
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="sr-only">Close</span>
      </Button>
    );

    const clickableArea = (
      <div
        // className="flex flex-col p-4 md:p-6"
        className="grid grid-flow-col gap-4 items-center place-content-center "
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          onClick && onClick(e)
        }
      >
        {image}
        {titleContent}
        {descriptionContent}
        {actionContent}
        {closeContent}
      </div>
    );

    return isOpenBanner ? (
      <div
        ref={ref}
        className={cn(bannerVariants({ type, className }))}
        {...props}
      >
        {linkHref ? <a href={linkHref}>{clickableArea}</a> : clickableArea}
      </div>
    ) : null;
  }
);

Banner.displayName = "Banner";

export { Banner, bannerVariants };

// import * as React from "react";
// import { VariantProps, cva } from "class-variance-authority";
// import { cn } from "@/lib/utils";
//
// const bannerVariants = cva(
//   "relative flex items-center justify-between p-4 rounded-md shadow-sm",
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:text-white",
//         warning:
//           "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:text-white",
//         error:
//           "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:text-white",
//         success:
//           "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:text-white",
//       },
//       padding: {
//         default: "p-5",
//         compact: "p-3",
//         spacious: "p-7",
//         none: "p-0",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       padding: "default",
//     },
//   }
// );
//
// export interface BannerProps extends VariantProps<typeof bannerVariants> {
//   title?: React.ReactNode;
//   description?: React.ReactNode;
//   children?: React.ReactNode;
//   bgColor?: string;
//   textColor?: string;
//   className?: string;
//   isActive?: boolean;
//   activeIndicator?: React.ReactNode;
//   linkHref?: string;
//   action?: React.ReactNode;
//   onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
// }
//
// const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
//   (
//     {
//       className,
//       variant,
//       title,
//       textColor = "white",
//       padding,
//       bgColor,
//       description,
//       isActive,
//       activeIndicator,
//       linkHref,
//       action,
//       onClick,
//       ...props
//     },
//     ref
//   ) => {
//     // const Banner = ({ title, children, bgColor, textColor }: BannerProps) => {
//     const [isOpen, setIsOpen] = React.useState(true);
//     const bannerStyles = cva(`
//     flex justify-between items-center px-4 py-3 text-center relative
//     bg-${bgColor}-600 text-${textColor}-100
//   `);
//     const bannerInnerStyles = cva(`
//     flex justify-between items-center w-full relative z-10
//   `);
//     const bannerTextStyles = cva(`
//     font-medium leading-5
//   `);
//     const bannerCloseStyles = cva(`
//     absolute top-0 bottom-0 right-0 flex items-center
//     pr-4 cursor-pointer text-${textColor}-100 hover:text-${textColor}-300
//     focus:outline-none focus:text-${textColor}-300
//   `);
//
//     return isOpen ? (
//       <div
//         ref={ref}
//         // className={}
//         className={`${bannerStyles()} ${cn(
//           bannerVariants({ variant, padding, className })
//         )}}`}
//         {...props}
//       >
//         <div className={bannerInnerStyles()}>
//           <div className={bannerTextStyles()}>{title}</div>
//           <button
//             className={bannerCloseStyles()}
//             type="button"
//             onClick={() => setIsOpen(false)}
//           >
//             <svg
//               className="w-6 h-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//             <span className="sr-only">Close</span>
//           </button>
//         </div>
//       </div>
//     ) : null;
//   }
// );
//
// Banner.displayName = "Banner";
//
// export { Banner, bannerVariants };
