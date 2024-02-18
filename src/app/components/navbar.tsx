"use client";
import { formatDistanceToNow } from "date-fns";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/app/assets/logo.png";
import axios from "axios";
type User = {
  name: string;
  email: string;
  savedRecipes: string[];
  userCreated: Date;
};
const NavBar: React.FC = () => {
  const { data: session, status }: any = useSession();
  const [userDetails, setUserDetails] = useState<User | null>({
    name: "N/A", 
    email: "N/A",
    savedRecipes: [],
    userCreated: new Date(),
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const path = usePathname()!;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formatDateDistance = (date: Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };
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
            navLink: "#",
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
            navLink: "#",
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
        className="text-white bg-[#20c536]"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <img
              src={Logo.src}
              className="h-8 sm:h-10 md:h-12 lg:h-12 xl:h-12 2xl:h-12 brandImg"
              alt="logo"
            />
            <h1 className="sm:h-6 font-bold text-inherit brand">DASH DISH</h1>
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
            <Link href="#">Search</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className={`hidden lg:flex`}>
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
                  <DropdownItem key="new" onPress={onOpen}>
                    My Account
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
            {
              session && session?.user && 
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
                <DropdownItem key="new" onPress={onOpen}>
                  My Account
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
            }
            
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full text-[#20c536]"
                href={item.navLink}
              >
                {item.navItem}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                My Account Details
              </ModalHeader>
              <ModalBody>
                {userDetails ? (
                  <>
                    <div className="mb-3">
                      <h3 className="font-semibold">Name:</h3>
                      <p>{userDetails.name}</p>
                    </div>
                    <div className="mb-3">
                      <h3 className="font-semibold">Email:</h3>
                      <p>{userDetails.email}</p>
                    </div>
                    <div className="mb-3">
                      <h3 className="font-semibold">Member Since:</h3>
                      <p>{formatDateDistance(userDetails.userCreated)}</p>
                    </div>
                  </>
                ) : (
                  <h1> Oops nothing to show here...</h1>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
};

export default NavBar;
