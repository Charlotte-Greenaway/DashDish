import React from "react";
import { useSession } from "next-auth/react";
type ShareButtonProps = {
  shoppingList: string[];
};

const ShareButton: React.FC<ShareButtonProps> = ({ shoppingList }) => {
  const { data: session }: any = useSession();

  const handleShare = async () => {
    if (session && session?.user) {
      const name= session?.user.name;
      const shareData = {
        title: `${name}'s Shopping List`,
        text: `${name}'s shopping list:\n" + shoppingList.join("\n")`,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback for browsers that do not support navigator.share
          console.log(
            "Share not supported on this browser, copy manually:",
            shareData.text
          );
        }
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-green-600 text-white font-bold py-1 px-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ml-2 text-sm"
    >
      Share
    </button>
  );
};

export default ShareButton;
