import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Toggle } from "@/components/ui/toggle";
import { Italic, Moon, SunMoon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex text-sm justify-between items-center">
      <div className="flex gap-6 items-center">
        <Link
          href="/"
          // legacyBehavior
          // passHref
          className={`${navigationMenuTriggerStyle()} cursor-pointer!`}
        >
          <div
            aria-label="Explorer"
            title="Explorer"
            className="text-base font-black relative tracking-wide uppercase!"
          >
            <span className="text-green-400!">e</span>
            <span className="text-green-400!">x</span>
            <span className="text-green-400!">p</span>
            <span className="text-green-400">/</span>
            <span className="text-green-400!">o</span>
            <span className="text-green-400!">r</span>
            <span className="text-green-400!">e</span>
            <span className="text-green-400!">r</span>
          </div>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/countries" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Countries
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pro" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pro
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center">
        <Auth />
        <ModeToggle />
      </div>
    </nav>
  );
}

// Auth component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
function Auth() {
  return (
    <div className={"font-medium"}>
      <SignedOut>
        <Link href="/sign-in">Sign in</Link>
      </SignedOut>
      <SignedIn>
        <UserButton userProfileUrl={"/user"} afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
