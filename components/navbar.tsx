import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Toggle } from "@/components/ui/toggle";
import { Italic, Moon, SunMoon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center">
      <Link
        href="/"
        legacyBehavior
        passHref
        className={`text-lg font-bold logo ${navigationMenuTriggerStyle()}`}
      >
        Explorer
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
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>About</NavigationMenuLink>
              <NavigationMenuLink>Docs</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ToggleSm />
    </nav>
  );
}

export function ToggleSm() {
  return (
    <Toggle size="sm" aria-label="Toggle theme">
      <SunMoon className="w-4 h-4" />
      <Moon className="w-4 h-4" />
    </Toggle>
  );
}
