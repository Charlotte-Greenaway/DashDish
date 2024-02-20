import { Badge, Card, CardHeader, CardBody, Image } from "@nextui-org/react"
import { FaCheck, FaHeart, FaStar} from "react-icons/fa";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast,{Toaster} from 'react-hot-toast';
import Link from "next/link";

interface Recipe{
    recipe:{
        _id:number;
        recipeId:string;
        recipeTitle:string;
        rating:number;
        image:{
            data:string
        };
        summary:string
    }
    
}

const RecipeWidget:React.FC<Recipe> = ({recipe}) =>{
    const { data: session }: any = useSession();
    const [savedStatus, setSavedStatus] = useState<boolean>(true);
    const saveRecipe = async (id: number) => {
        if (session && session?.user) {
          if (savedStatus) {
            setSavedStatus(false);
            const res = await axios.post("/api/users/removeSavedRecipe", {
              id: id,
            });
            if (res.data.status !== 200) {
              setSavedStatus(true);
              toast.error("Could not save recipe");
            }
          } else {
            setSavedStatus(true);
            const res = await axios.post("/api/users/saveRecipe", {
              id: id,
            });
            if (res.data.status !== 200) {
              setSavedStatus(false);
              toast.error("Could not unsave recipe");
            } 
          }
        } else {
          toast.error("Sign in to save recipes");
        }
      };
    return(
        <>

            <div className="fitcont lg:w-1/3" key={recipe._id}>
              <Badge
                content={
                  savedStatus ? (
                    <FaCheck color="white" size={20} className="my-2 mx-1" />
                  ) : (
                    <FaHeart color="white" size={20} className="my-2 mx-1" />
                  )
                }
                color="danger"
                shape="circle"
                placement="top-right"
                onClick={() => saveRecipe(recipe._id)}
                className="cursor-pointer"
                style={{
                  transition: "color 0.3s, background-color 0.3s",
                }}
              >
                <Link
                  className="py-4 fitcont my-3 mx-1"
                  href={`/recipe?id=${recipe._id}${savedStatus ? "&saved=true" : ""}`}
                >
                  <Card
                    className="py-4 fitcont mx-auto my-3"
                    key={recipe.recipeId}
                  >
                    <CardHeader className="pb-0 pt-2 px-4 flex-col recipes-start mx-auto">
                      <p className="text-tiny uppercase font-bold mx-auto max-w-[300px] text-center truncate">
                        {recipe.recipeTitle}
                      </p>
                      {recipe.rating > 0 ? (
                        <div className="flex mx-auto my-3">
                          {Array.from({ length: recipe.rating }).map(
                            (_, index) => (
                              <FaStar key={index} color="gold" size={20} />
                            )
                          )}
                        </div>
                      ) : (
                        // If there are no ratings, render a message with a grey star
                        <>
                          <small className="inline mx-auto my-3">
                            <FaStar color="grey" size={20} className="inline" />{" "}
                            No Ratings
                          </small>
                        </>
                      )}
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 mx-auto">
                      <div className="image-container fit-content rounded-xl">
                        <Image
                          alt="Card background"
                          className="object-cover rounded-xl mx-auto fitcont"
                          src={`data:image/png;base64,${Buffer.from(
                            recipe.image.data
                          ).toString("base64")}`}
                          width={270}
                        />
                        <div className="image-overlay rounded-xl max-h-12 overflow-hidden max-w-screen">
                          <p>{recipe.summary}</p>
                        </div>
                      </div>
                    </CardBody>

                  </Card>
                </Link>
              </Badge>
              </div>
              <Toaster/>
        </>
    )
}
export default RecipeWidget;