"use client"
import { FaShoppingBasket, FaCheck } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { usePathname } from "next/navigation";
interface item{
    item:string;
    isModal:boolean;
}
const ShoppingButton:React.FC<item> = ({item, isModal}) => {
  const [isSaved, setIsSaved] = useState(isModal);
  const saveToSl = async() => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      //axios post item
      const saved = await axios.post("/api/users/addShoppingItem",{
        item:item
      })
      if(saved.data.status==200){
        toast.success("Item added to shopping list.")
      }else{
        setIsSaved(false);
        toast.error("Could not remove item")
      }
    } else {
      //remove item
      //axios post item
      const saved = await axios.post("/api/users/removeShoppingItem",{
        item:item
      })
      if(saved.data.status==200){
        toast.success("Item removed to shopping list.")
      }else{
        setIsSaved(true);
        toast.error("Could not remove item")
      }
    }
   
  };
  return (
      <button
        onClick={saveToSl}
        aria-description="add to shopping list"
        className="mx-2 bg-green-400 px-3 py-1 rounded-md h-7 "
      >
        {isSaved ? (
          <FaCheck size={15} color="white" />
        ) : (
          <FaShoppingBasket size={15} color="white" />
        )}
      </button>

  );
};

export default ShoppingButton;
