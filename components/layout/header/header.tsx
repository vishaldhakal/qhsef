"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  { href: "/#about", label: "About" },
  { href: "/#objectives", label: "Objectives" },
  { href: "/#advantages", label: "Advantages" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setOpen(false);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="bg-white  py-2 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/cim-logo.webp" alt="CIM Logo" width={80} height={80} />
            <Image src="/logo.png" alt="MDMU Logo" width={80} height={80} />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    legacyBehavior
                    passHref
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                  >
                    <NavigationMenuLink className="hover:text-[#2964f0] font-bold px-4 py-2">
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button className="bg-white text-[#0A1E4B] hover:bg-gray-200" asChild>
            <Link href={"/qhsef"}>Check Quality</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A1E4B] text-white w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-[#0A1E4B] text-lg px-4 py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  className="bg-white text-[#0A1E4B] hover:bg-gray-200 mx-4"
                  onClick={() => {
                    scrollToSection("#apply");
                    setOpen(false);
                  }}
                >
                  Apply for Logo
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Header;
