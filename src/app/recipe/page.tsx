"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import RecipeInstructions from "../components/recipe_page/instructions";
import {
  FaStar,
  FaHeart,
  FaCheck,
  FaFacebook,
  FaEnvelope,
  FaLink
} from "react-icons/fa";
import ShoppingButton from "../components/buttons/shoppingListButton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

interface Recipe {
  message: {
    _id: number;
    recipeTitle: string;
    summary: string;
    rating: number;
    numOfRatings: number;
    image: {
      data: string;
    };
    allergens: string[];
    cuisine: string[];
    diets: string[];
    mealType: string[];
    timeInHours: number;
    equipmentNeeded: string[];
    winePairings: string[];
    ingredients: string[];
    instructions:string[]
  };
  missingIngs: string[];
  matchedIngs: string[];
}

export default function RecipePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session }: any = useSession();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [hasRated, setRated] = useState<boolean>(false);
  const [loading, isLoading] = useState<Boolean>(true);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const getRecipe = async (id: any, missingIngs: any) => {
    const response = await axios.post("/api/recipes/getRecipeById", {
      id: id,
      missingIngs: missingIngs,
    });
    setRecipe(response.data);
    isLoading(false);
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Could not copy to clipboard.");
    }
  };

  const submitRating = async (index: number) => {
    if (recipe && !hasRated) {
      const userRating = index + 1;
      const response = await axios.post("/api/users/setRating", {
        id: recipe.message._id,
        userRating: userRating,
        rating: recipe.message.rating,
        numOfRatings: recipe.message.numOfRatings,
      });
      if (response.data.status == 200) {
        recipe.message.rating = response.data.message;
        recipe.message.numOfRatings += 1;
        setRated(true);
        onOpen();
      } else {
        toast.error("Could not set rating");
      }
    }
  };

  useEffect(() => {
    if (!searchParams.get("id")) {
      window.location.href = "/";
    } else {
      const id = searchParams.get("id");
      const missingIngs = searchParams.get("missingIngs");
      if (missingIngs) {
        getRecipe(id, missingIngs);
      } else {
        getRecipe(id, "No Ingredients");
      }
    }
    if (searchParams.get("saved") === "true") {
      setSavedStatus(true);
    }
  }, []);

  const saveRecipe = async (id: number) => {
    if (session && session?.user) {
      if (!savedStatus) {
        setSavedStatus(true);
        const res = await axios.post("/api/users/removeSavedRecipe", {
          id: id,
        });
        if (res.data.status !== 200) {
          setSavedStatus(false);
          toast.error("Could not save recipe");
        }
      } else {
        setSavedStatus(false);
        const res = await axios.post("/api/users/saveRecipe", {
          id: id,
        });
        if (res.data.status !== 200) {
          setSavedStatus(true);
          toast.error("Could not unsave recipe");
        }
      }
    } else {
      toast.error("Sign in to save recipes");
    }
  };

  return (
    <>
    <Suspense>
      {recipe && (
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row">
            <div className="w-screen lg:w-1/2 flex px-10 py-10 lg:py-0 justify-center flex-col max-h-screen">
              <div className="flex flex-row justify-around my-7">
                <div
                  color="danger"
                  onClick={() => saveRecipe(recipe.message._id)}
                  className=" w-8 h-8 cursor-pointer bg-red-600 rounded-full flex"
                  style={{
                    transition: "color 0.3s, background-color 0.3s",
                  }}
                >
                  {savedStatus ? (
                    <FaCheck color="white" size={20} className=" m-auto" />
                  ) : (
                    <FaHeart color="white" size={20} className="m-auto" />
                  )}
                </div>
                <div className=" flex flex-row">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=www.dashdish.co.uk?id=${recipe.message._id}`}
                    target="_blank"
                  >
                    <FaFacebook size={35} color="#1877f2" className="mx-3" />
                  </a>
                  <a
                    href={`mailto:?subject=${"Check out this link!"}&body=${encodeURIComponent(
                      `I thought you might be interested in this link: www.dasdish.co.uk?id=${recipe.message._id}`
                    )}`}
                  >
                    <FaEnvelope size={35} color="#1877f2" className="mx-3" />
                  </a>

                  <FaLink
                    size={35}
                    color="#1877f2"
                    className="mx-3 hover:cursor-pointer"
                    onClick={() =>
                      handleCopy(
                        `https://www.dashdish.co.uk/recipe?id=${recipe.message._id}`
                      )
                    }
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-center">
                {recipe.message.recipeTitle}
              </h1>
              <p className="text-center p-5">{recipe.message.summary}</p>
              <hr className="border-t-2 border-gray-300 my-4" />
              <small className="text-center p-4 justify-center">
                This recipe was generated by AI, please give us a rating!
              </small>
              <div>
                {
                  <div className="flex justify-center items-center my-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        className="fit-content !m-0"
                        key={index}
                        color={
                          index <= hoveredIndex ||
                          (index < recipe.message.rating && hoveredIndex == -1)
                            ? "#20c536"
                            : "rgba(169, 169, 169, 0.5)"
                        }
                        size={30}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        onClick={() => submitRating(index)}
                      />
                    ))}
                  </div>
                }
              </div>
              {recipe.message.rating == 0 ? (
                <small className="mx-auto">No Ratings</small>
              ) : (
                <small className="mx-auto">
                  {recipe.message.numOfRatings} Ratings
                </small>
              )}
            </div>
            <img
              className="w-screen lg:w-1/2 flex-end max-h-screen"
              src={`data:image/png;base64,${Buffer.from(
                recipe.message.image.data
              ).toString("base64")}`}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-5 w-full px-8">
            <Table
              aria-label="Selection behavior table example with dynamic content"
              color="success"
              isHeaderSticky
              className="w-full md:w-1/2 h-full pt-4"
              removeWrapper
            >
              <TableHeader>
                <TableColumn>Matched Ingredients</TableColumn>
                <TableColumn>Missing Ingredients</TableColumn>
              </TableHeader>
              <TableBody emptyContent={`Log in or add ingredients`}>
                {recipe.missingIngs.length > recipe.matchedIngs.length
                  ? recipe.missingIngs.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <h4 className="text-md text-green-600">
                            {recipe.matchedIngs[index] || ""}
                          </h4>
                        </TableCell>
                        <TableCell>
                          <h4 className="text-md text-green-600 flex flex-row justify-around">{item}{
                              session && session?.user && (
                                <ShoppingButton item={item} isModal={false}/>
                              )
                            }</h4>
                        </TableCell>
                      </TableRow>
                    ))
                  : recipe.matchedIngs.map((item, index) => (
                      <TableRow key={index + 500}>
                        <TableCell>
                          <h4 className="text-md text-green-600">{item}</h4>
                        </TableCell>
                        <TableCell>
                          <h4 className="text-md text-green-600">
                            {recipe.missingIngs[index] || ""}
                            {
                              session && session?.user && (
                                <ShoppingButton item={item} isModal={false}/>
                              )
                            }
                          </h4>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Table
              aria-label="Selection behavior table example with dynamic content"
              color="success"
              isHeaderSticky
              className="w-full md:w-1/2"
            >
              <TableHeader>
                <TableColumn>Ingredients</TableColumn>
              </TableHeader>
              <TableBody>
                {recipe.message.ingredients.map((item, index) => (
                  <TableRow key={index + 200}>
                    <TableCell>
                      <h4 className="text-xl text-green-600">{item}</h4>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full px-8 py-4 bg-white/70 my-4">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Recipe Details
            </h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <div className="mb-4">
                  <strong className="text-green-800">Diets:</strong>
                  <div className="mt-1">
                    {recipe.message.diets.length > 0 ? (
                      recipe.message.diets.map((diet) => (
                        <Chip color="success" variant="faded" className="mr-2">
                          {diet}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <strong className="text-green-800">Allergens:</strong>
                  <div className="mt-1">
                    {recipe.message.allergens.length > 0 ? (
                      recipe.message.allergens.map((allergen) => (
                        <Chip color="success" variant="faded" className="mr-2">
                          {allergen}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <strong className="text-green-800">Cuisine:</strong>
                  <div className="mt-1">
                    {recipe.message.cuisine.length > 0 ? (
                      recipe.message.cuisine.map((cuisine) => (
                        <Chip color="success" variant="faded" className="mr-2">
                          {cuisine}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-2">
                <div className="mb-4">
                  <strong className="text-green-800">Meal Type:</strong>
                  <div className="mt-1">
                    {recipe.message.mealType.length > 0 ? (
                      recipe.message.mealType.map((meal) => (
                        <Chip color="success" variant="faded" className="mr-2">
                          {meal}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <strong className="text-green-800">Wine Pairings:</strong>
                  <div className="mt-1">
                    {recipe.message.winePairings.length > 0 ? (
                      recipe.message.winePairings.map((wine) => (
                        <Chip color="success" variant="faded" className="mr-2">
                          {wine}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <strong className="text-green-800">Preparation Time:</strong>{" "}
                  <span className="text-black">
                    {recipe.message.timeInHours >= 1
                      ? `${Math.floor(recipe.message.timeInHours)} ${
                          Math.floor(recipe.message.timeInHours) === 1
                            ? "hour"
                            : "hours"
                        }`
                      : `${Math.round(
                          recipe.message.timeInHours * 60
                        )} minutes`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <RecipeInstructions instructions={recipe.message.instructions}/>

          <Modal
            backdrop="opaque"
            isOpen={isOpen}
            onClose={onClose}
            className="m-auto"
            placement="center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-center">
                    Success
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-center">Thanks for the feedback!</p>
                    <p className="text-center">
                      To contact us further, please email
                      enquiries@dashdish.co.uk
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      className="mx-auto"
                      variant="light"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
      {loading && (
        <div className="show">
          <span className="loader mx-auto"></span>
          <span className="loader2">Loading</span>
        </div>
      )}
      <Toaster />
      </Suspense>
    </>
  );
}
