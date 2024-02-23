"use client";

import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AccountModal from "./accountModal";
import ShoppingModal from "./ShoppingModal";
import { usePathname } from "next/navigation";
import Logo from "@/app/assets/logo.png";
import axios from "axios";
type User = {
  name: string;
  email: string;
  savedRecipes: string[];
  userCreated: Date;
  shoppingList: string[];
};
const NavBar: React.FC = () => {
  const { data: session }: any = useSession();
  const [userDetails, setUserDetails] = useState<User | null>({
    name: "N/A",
    email: "N/A",
    savedRecipes: [],
    userCreated: new Date(),
    shoppingList: [],
  });
  const [shoppingOpen, isShoppingOpen] = useState<boolean>(false);
  const [accountOpen, isAccountOpen] = useState<boolean>(false);
  const getUserDetails = async () => {
    const details = await axios.post("/api/users/getUserDetails");
    if (details.data.status == 200) {
      setUserDetails(details.data.message);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      getUserDetails();
    }
  }, [session]);
  useEffect(() => {
    if (session && session?.user) {
      getUserDetails();
    }
  }, [shoppingOpen]);
  const path = usePathname()!;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems =
    session && session.user
      ? [
          {
            navItem: "Home",
            navLink: "/",
          },
          {
            navItem: "Saved Recipes",
            navLink: "/saved-recipes",
          },
          {
            navItem: "Search",
            navLink: "/search",
          },
          {
            navItem: "Sign Out",
            navLink: "#",
          },
        ]
      : [
          {
            navItem: "Home",
            navLink: "/",
          },
          {
            navItem: "Saved Recipes",
            navLink: "/saved-recipes",
          },
          {
            navItem: "Search",
            navLink: "/search",
          },
          {
            navItem: "Sign up or Log In",
            navLink: "/login",
          },
        ];

  return (
    <header className="text-white bg-[#20c536] sticky top-0 z-50">
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="text-white bg-[#20c536]"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className=" flex flex-row items-center">
              <img
                src={Logo.src}
                className="h-8 sm:h-10 md:h-12 lg:h-12 xl:h-12 2xl:h-12 brandImg"
                alt="logo"
              />
              <h1 className="sm:h-6 font-bold text-inherit brand">DASH DISH</h1>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className={`hidden sm:flex gap-4 `} justify="center">
          <NavbarItem isActive={path === "/" ? true : false}>
            <Link href="/">Home</Link>
          </NavbarItem>
          <NavbarItem isActive={path === "/saved-recipes" ? true : false}>
            <Link href="/saved-recipes">Saved Recipes</Link>
          </NavbarItem>
          <NavbarItem isActive={path === "/search" ? true : false}>
            <Link href="/search">Search</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className={`hidden md:flex`}>
            {session?.user ? (
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    color="success"
                    showFallback
                    name={session.user.name}
                    src={session.user.image}
                    className="hover:cursor-pointer"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new" onClick={() => isAccountOpen(true)}>
                    My Account
                  </DropdownItem>
                  <DropdownItem key="new" onClick={() => isShoppingOpen(true)}>
                    My Shopping List
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onClick={() => signOut()}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button as={Link} color="primary" href="/login" variant="flat">
                Log in / Sign Up
              </Button>
            )}
          </NavbarItem>
          <NavbarItem>
            {session && session?.user && (
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    color="success"
                    showFallback
                    name={session.user.name}
                    src={session.user.image}
                    className="hover:cursor-pointer block md:hidden"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new" onClick={() => isAccountOpen(true)}>
                    My Account
                  </DropdownItem>
                  <DropdownItem key="new" onClick={() => isShoppingOpen(true)}>
                    My Shopping List
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onClick={() => signOut()}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full text-[#20c536]"
                href={item.navLink}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item.navItem == "Sign Out") {
                    signOut();
                  }
                }}
              >
                {item.navItem}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      {userDetails && (
        <>
          <AccountModal
            userDetails={userDetails}
            isModalOpen={accountOpen}
            setOpen={isAccountOpen}
          />
          <ShoppingModal
            userDetails={userDetails}
            isModalOpen={shoppingOpen}
            setOpen={isShoppingOpen}
          />
        </>
      )}
      <Toaster />
    </header>
  );
};

export default NavBar;
