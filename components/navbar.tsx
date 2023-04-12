import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <>
      <nav className="flex justify-between">
        <Link href="/" className="logo font-bold text-lg">
          Where are we?
        </Link>
        <div className="theme-toggle">Dark Mode</div>
      </nav>
    </>
  );
}
