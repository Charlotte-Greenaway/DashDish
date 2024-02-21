import {
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";
import localForage from "localforage";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
type User = {
  userDetails: {
    name: string;
    email: string;
    savedRecipes: string[];
    userCreated: Date;
    shoppingList: string[];
  };
  isModalOpen: boolean;
  setOpen: any;
};

const AccountModal: React.FC<User> = ({
  userDetails,
  isModalOpen,
  setOpen,
}) => {
  const { data: session }: any = useSession();
  const [deletionEmail,setDeletionEmail]=useState<string>("")
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formatDateDistance = (date: Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };
  useEffect(() => {
    if (session && session?.user) {
      if (isModalOpen) {
        onOpen();
      }
    }
  }, [isModalOpen]);
  const deleteAccountAction = () => {
    const deleteAccount = async() => {
        const status = await axios.post("/api/users/deleteUser");
        if(status.data.status==200){
            toast.success("Account successfully deleted!");
            if(await localForage.getItem("allRecipes")){
                await localForage.removeItem("allRecipes");
            }
            signOut();
        }else{
            toast.error("Could not delete account")
        }
    }
    if(session && session?.user){
        toast((t) => (
            <span className="flex flex-col justify-center items-center  text-xl w-full">
              <p className="truncate px-8 mx-4 my-3">Confirm Account Deletion</p>
              <div className="flex flex-row justify-evenly items-center w-full">
              <Button color="success" className="my-4" variant="ghost" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
              <Button color="danger" className="my-4" variant="ghost" onClick={() =>{ toast.dismiss(t.id); deleteAccount();}}>Delete</Button>
              </div>
            </span>
          ));
    }else{
        toast.error("Could not delete account")
    }
    
  }


  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        placement="center"
        hideCloseButton
        isDismissable={false}
        scrollBehavior="inside"
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
                    <hr/>
                    <div>
                    <h3 className="text-xl text-red-600 text-center mb-3">Danger Zone</h3>
                    <p className="text-center my-2 text-black">Enter your email address to delete account</p>
                    <Input isClearable placeholder="email address" variant="bordered" color="danger" onChange={(e)=>{setDeletionEmail(e.target.value)}} value={deletionEmail}></Input>
                    <Button
                      color="danger"
                      variant="solid"
                      onPress={deleteAccountAction}
                      className="w-full my-4"
                    >
                      Delete Account
                    </Button>
                    </div>
                  </>
                ) : (
                  <h1> Oops nothing to show here...</h1>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setOpen(false);
                  }}
                >
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
export default AccountModal;
