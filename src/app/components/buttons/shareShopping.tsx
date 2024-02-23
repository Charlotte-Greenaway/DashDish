import React from 'react';

type ShareButtonProps = {
  shoppingList: string[];
};

const ShareButton: React.FC<ShareButtonProps> = ({ shoppingList }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'My Shopping List',
      text: 'Here is my shopping list:\n' + shoppingList.join('\n'),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('List shared successfully!');
      } else {
        // Fallback for browsers that do not support navigator.share
        console.log('Share not supported on this browser, copy manually:', shareData.text);
      }
    } catch (error) {
      console.error('Error sharing:', error);
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