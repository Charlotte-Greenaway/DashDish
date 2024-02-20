"use client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import ShoppingButton from "./buttons/shoppingListButton";
import DownloadWordButton from "./buttons/downoadListButton";
import { FaEnvelope } from "react-icons/fa";
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
  shoppingList: string[];
};
const NavBar: React.FC = () => {
  const { data: session, status }: any = useSession();
  const [userDetails, setUserDetails] = useState<User | null>({
    name: "N/A",
    email: "N/A",
    savedRecipes: [],
    userCreated: new Date(),
    shoppingList: [],
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const getUserDetails = async () => {
    const details = await axios.post("/api/users/getUserDetails");
    if (details.data.status == 200) {
      setUserDetails(details.data.message);
    }
  };
  const [modalContent, setModalContent] = useState<string>("account");
  useEffect(() => {
    if (session && session.user) {
      getUserDetails();
    }
  }, [session,modalContent, isOpen]);
  const path = usePathname()!;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  function createMailtoLink(shoppingList:string[]) {
    const emailSubject = "My Shopping List";
    const emailBody = `
      <p>Hi there,</p>
      <p>Here's my shopping list:</p>
      <ul>
        ${shoppingList.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <p>Best regards,</p>`;
  
    // Encode subject and body for URL
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
  
    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }
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
                  <DropdownItem
                    key="new"
                    onPress={onOpen}
                    onClick={() => setModalContent("account")}
                  >
                    My Account
                  </DropdownItem>
                  <DropdownItem
                    key="new"
                    onPress={onOpen}
                    onClick={() => setModalContent("shoppinglist")}
                  >
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
                  <DropdownItem
                    key="new"
                    onPress={onOpen}
                    onClick={() => setModalContent("account")}
                  >
                    My Account
                  </DropdownItem>
                  <DropdownItem
                    key="new"
                    onPress={onOpen}
                    onClick={() => setModalContent("shoppinglist")}
                  >
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
              <Link className="w-full text-[#20c536]" href={item.navLink} onClick={()=>{setIsMenuOpen(false); if(item.navItem=="Sign Out"){ signOut()}}}>
                {item.navItem}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="opaque" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {
                  modalContent=="account"?(
                    <>My Account Details</>
                  ):(
                    <>My Shopping List</>
                  )
                  }
              </ModalHeader>
              <ModalBody>
                {userDetails && modalContent == "account" ? (
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
                ) : userDetails && modalContent == "shoppinglist" ? (
                  <>
                  <div className="flex flex-row items-center">
                  <Link href={createMailtoLink(userDetails.shoppingList)} className="mx-4"><FaEnvelope size={20} color="green"/></Link>
                  <DownloadWordButton shoppingList={userDetails.shoppingList}/>
                  </div>
                  <div className="flex flex-col bg-white rounded-lg p-4 shadow-lg">
                    <div className="divide-y divide-gray-200">
                      {userDetails.shoppingList.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2"
                        >
                          <p className="text-gray-600 text-sm">{item}</p>
                          <ShoppingButton item={item} isModal={true}/>
                        </div>
                      ))}
                    </div>
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
