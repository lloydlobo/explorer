import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heading, HeadingProps, headingVariants } from "./ui/typography";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ICountry } from "@/lib/types/types-country";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";

const isSSR = typeof window === "undefined";

type Props = {
  guesses: string[];
  guessLimit: number;
  // children?: React.ReactNode;
  // className?: string
  // style?: CSSProperties
  // onClick?: () => void
};

type TGuess = {
  id: string;
  alpha3Code: ICountry["alpha3Code"];
};

// // Use uuid for guessLimit. array.
// // https://www.joshwcomeau.com/react/common-beginner-mistakes/
// // HACK: Check if window is defined, if not pass the value as number as id.
// function handleAddItem(value: number): TGuess {
//   // id: crypto.randomUUID(),
//   const nextItem: TGuess = {
//     id: isSSR ? String(value) : nanoid(), //=> "V1StGXR8_Z5jdHi6B-myT"
//     alpha3Code: String(value),
//   };
//   return nextItem;
// }
//
// function AccordianGuesses({ guesses, guessLimit }: Props) {
//   const guessStore = Array.from(Array(guessLimit)).map(handleAddItem);
//
//   const [array, setArray] = useState(guessStore);
//
//   // useEffect(() => {
//   //   const newArray = array.map((item, idxItem) => {
//   //     if (guesses.length <= idxItem && guesses[idxItem] !== null) {
//   //       const updateItem = structuredClone(item);
//   //       updateItem.alpha3Code = guesses[idxItem];
//   //       return updateItem;
//   //     }
//   //     return item;
//   //   });
//   //
//   //   setArray(newArray);
//   //
//   //   return () => {};
//   // });
//
//   return (
//     <div className="relative">
//       <Accordion type="single" collapsible>
//         {array.map(({ alpha3Code, id }, idxArray) => (
//           <AccordionItem
//             key={`guess-${alpha3Code}-${id}-${idxArray}`}
//             value={alpha3Code}
//           >
//             <AccordionTrigger>{alpha3Code}</AccordionTrigger>
//             <AccordionContent>
//               <AccordianGuess guess={alpha3Code} />
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//
//       {/* <div className="absolute">{children}</div> */}
//     </div>
//   );
// }

type GuessProps = {
  guess: string;
  children?: React.ReactNode;
  className?: string;
  variant?: HeadingProps["variant"];
  onClick?: () => void;
  // style?: CSSProperties
};

function AccordianGuesses({ guesses, guessLimit }: Props) {
  const [g, setG] = useState(guesses);
  console.log(g);
  // alert(guessLimit);
  useEffect(() => {
    // alert(JSON.stringify(guesses));
    setG(guesses);
    return () => {};
  }, [guesses]);
  return (
    <Accordion type="single" collapsible>
      {Array.from(Array(guessLimit)).map((count, idxCount) => (
        <AccordionItem
          key={`${count}-${idxCount}`}
          value={guesses.at(idxCount) ?? ""}
        >
          <AccordionTrigger>{guesses.at(idxCount)}</AccordionTrigger>
          <AccordionContent>
            <AccordianGuess guess={guesses.at(idxCount) ?? ""} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function AccordianGuess({
  guess,
  children,
  className,
  variant = "h4",
  onClick,
  ...props
}: GuessProps) {
  return (
    <div className={cn(className, "flex flex-col p-0 m-0 gap-2")} {...props}>
      <Heading variant={variant}>{guess}</Heading>
    </div>
  );
}

export { AccordianGuesses, AccordianGuess };
