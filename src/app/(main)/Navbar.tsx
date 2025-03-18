"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme } = useTheme();
  return (
    <header className="shadow-sm">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-3">
        <Link href={"/resumes"} className="flex items-center gap-2">
          <Image
            src={logo}
            className="rounded-full"
            width={35}
            height={35}
            alt="logo"
          />
          <span className="tracking-tight text-xl font-bold">
            AI Resume Builder
          </span>
        </Link>
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "35",
                  height: "35",
                },
              },
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
