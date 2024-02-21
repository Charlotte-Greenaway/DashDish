import {
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import ShoppingButton from "./buttons/shoppingListButton";
import DownloadWordButton from "./buttons/downoadListButton";
import { FaEnvelope } from "react-icons/fa";
type User = {
  userDetails: {
    name: string;
    email: string;
    savedRecipes: string[];
    userCreated: Date;
    shoppingList: string[];
  };
  isModalOpen:boolean;
  setOpen:any;
};

const ShoppingModal: React.FC<User> = ({ userDetails, isModalOpen, setOpen}) => {
  const { data: session }: any = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (session && session?.user) {
        if (isModalOpen) {
          onOpen();
        }
    }
  }, [isModalOpen]);
  function createMailtoLink(shoppingList: string[]) {
    const emailSubject = "My Shopping List";
    const emailBody = `
      <p>Hi there,</p>
      <p>Here's my shopping list:</p>
      <ul>
        ${shoppingList.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p>Best regards,</p>`;

    // Encode subject and body for URL
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);

    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        placement="center"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <>My Account Details</>
              </ModalHeader>
              <ModalBody>
                {userDetails ? (
                  <>
                    <div className="flex flex-row items-center">
                      <Link
                        href={createMailtoLink(userDetails.shoppingList)}
                        className="mx-4"
                      >
                        <FaEnvelope size={20} color="green" />
                      </Link>
                      <DownloadWordButton
                        shoppingList={userDetails.shoppingList}
                      />
                    </div>
                    <div className="flex flex-col bg-white rounded-lg p-4 shadow-lg">
                      <div className="divide-y divide-gray-200">
                        {userDetails.shoppingList.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2"
                          >
                            <p className="text-gray-600 text-sm">{item}</p>
                            <ShoppingButton item={item} isModal={true} />
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
                <Button color="danger" variant="light" onPress={()=>{onClose(); setOpen(false)}}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ShoppingModal;
