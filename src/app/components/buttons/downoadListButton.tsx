import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import logo from '../../assets/logo.png'
interface ShoppingList{
    shoppingList:string[];
}
function downloadShoppingListAsWord(shoppingList: string[]) {
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Calibri", // A clean, professional font
            },
          },
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 32, // 16pt font size
              bold: true,
              color: "004D40", // A dark green color for the heading
            },
            paragraph: {
              spacing: { after: 240 }, // Add some space after the heading
            },
          },
          {
            id: "ListItem",
            name: "List Item",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 24, // 12pt font size, for better readability
              color: "00796B", // A slightly lighter green for list items
            },
            paragraph: {
              spacing: { after: 120 }, // Space after each list item for readability
            },
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Shopping List",
              style: "Heading1",
            }),
            ...shoppingList.map(item => 
              new Paragraph({
                text: item,
                style: "ListItem",
              })
            ),
          ],
        },
      ],
    });
  
    // Use Packer to create a binary blob from the document
    Packer.toBlob(doc).then(blob => {
      // Use FileSaver to save the generated blob as a .docx file
      saveAs(blob, "ShoppingList.docx");
    });
  }


// React button component for downloading the shopping list
const DownloadWordButton: React.FC<ShoppingList> = ({ shoppingList }) => {
  return (
    <button onClick={() => downloadShoppingListAsWord(shoppingList)}>
      <FaDownload color="green" size={20}/>
    </button>
  );
};

export default DownloadWordButton;
