import React from "react";

export function Footer() {
  const CURRENT_YEAR = new Date().getFullYear();
  return (
    <footer className="container">
      <div className="flex flex-col gap-3 justify-between items-center py-10 border-t md:flex-row md:py-0 md:h-24 border-t-slate-199 dark:border-t-slate-700">
        <div className="flex flex-col gap-4 items-center px-8 md:flex-row md:gap-2 md:px-0">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <circle cx={12} cy={12} r={10} />
          </svg>
          <p className="text-sm leading-loose text-center md:text-left text-slate-600 dark:text-slate-400">
            <span>{CURRENT_YEAR}</span> Built by{/* */}{" "}
            <a
              href="https://github.com/lloydlobo"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Lloyd Lobo
            </a>
            . The source code is available on{/* */}{" "}
            <a
              href="https://github.com/lloydlobo/explorer"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
