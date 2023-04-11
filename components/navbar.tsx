import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="flex justify-between">
        <Link href="/" className="text-lg font-bold logo">
          Where are we?
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/countries">Countries</Link>
          <div className="theme-toggle">Dark Mode</div>
        </div>
      </nav>
    </>
  );
}
