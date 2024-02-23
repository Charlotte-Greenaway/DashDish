"use client";
import React, { useState, KeyboardEvent, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import ResultsIngs from "./ingredient_results/results";
import localForage from "localforage";

// Define a type for the ingredient object
type Ingredient = {
  id: number;
  name: string;
  isDeleting: boolean;
};
interface IngredientInputProps {
  initialIngredients: string[]; // Define initialIngredients prop
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  initialIngredients,
}) => {
  //
  const [ingredient, setIngredient] = useState<string>("");
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const { data: session, status }: any = useSession();
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialIngredients.map((name, index) => ({
      id: index,
      name,
      isDeleting: false,
    }))
  );
  const updateIngredients = async () => {
    if (session && session.user) {
      const saveIngredients = ingredients.map((item) => item.name);
      const res = await axios.post("/api/ingredients/setIngredients", {
        ingredients: saveIngredients,
      });
      if (res.data.status !== 200) {
        console.warn(res.data.message);
      }
    }
  };
  useEffect(() => {
    updateIngredients(); // This will call updateIngredients whenever 'ingredients' changes
  }, [ingredients]);
  const getUserDetails = async () => {
    const details = await axios.post("/api/users/getUserDetails");
    if (details.data.status == 200) {
      setSavedRecipes(details.data.message.savedRecipes);
    }
  };
  async function retrieveRecipes() {
    try {
      const recipes = await localForage.getItem("allRecipes");
      if (Array.isArray(recipes) && session && session?.user) {
        await setRecipes(recipes);
      }
    } catch (error) {
      console.error("Failed to retrieve recipes:", error);
    }
  }
  useEffect(()=>{
    retrieveRecipes();
  },[session])
  useEffect(() => {
    getUserDetails();
  }, []);

  const addIngredient = (): void => {
    if (ingredient) {
      setIngredients((prev) => [
        ...prev,
        { id: Date.now(), name: ingredient, isDeleting: false },
      ]);
      setIngredient("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      addIngredient();
    }
  };

  const deleteIngredient = (ingredientId: number): void => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === ingredientId ? { ...ing, isDeleting: true } : ing
      )
    );
    setTimeout(() => {
      setIngredients(ingredients.filter(({ id }) => id !== ingredientId));
    }, 500); // Match this delay with the duration of your fade-out animation
  };
  async function storeRecipes(recipes: any) {
    try {
      if (session && session?.user) {
        await localForage.setItem("allRecipes", recipes);
      }
    } catch (error) {
      console.error("Failed to store recipes:", error);
    }
  }

  const getRecipesByIngs = async () => {
    setIsAnalysing(true);
    const ingredientsPostValue = ingredients.map((item) => item.name);
    if (ingredientsPostValue.length < 1) {
      toast.error("Please enter some ingredients!");
    } else {
      const recipeResponse = await axios.post(
        "/api/recipes/getRecipesByIngredients",
        {
          ingredients: ingredientsPostValue,
        }
      );
      setRecipes(recipeResponse.data.message);
      localForage.config({
        name: "Dash Dish",
        storeName: "recipes",
      });
      await storeRecipes(recipeResponse.data.message);
    }
    setIsAnalysing(false);
  };

  return (
    <>
    <div className="max-w-[1150px] mx-auto bg-white">
      <div className="mt-5 p-6 max-w-2xl mx-auto flex flex-col items-center space-y-4">
        <div className="flex flex-row items-center justify-center">
          <h2 className="text-2xl font-semibold">Add Your Ingredients</h2>
          <Tooltip
            color="default"
            content={
              "Add Ingredients from your kitchen to see what recipes you can make!"
            }
            closeDelay={500}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-2 hover:cursor-pointer"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.75 15V16.5H11.25V15H12.75ZM10.5 10.4318C10.5 9.66263 11.1497 9 12 9C12.8503 9 13.5 9.66263 13.5 10.4318C13.5 10.739 13.3151 11.1031 12.9076 11.5159C12.5126 11.9161 12.0104 12.2593 11.5928 12.5292L11.25 12.7509V14.25H12.75V13.5623C13.1312 13.303 13.5828 12.9671 13.9752 12.5696C14.4818 12.0564 15 11.3296 15 10.4318C15 8.79103 13.6349 7.5 12 7.5C10.3651 7.5 9 8.79103 9 10.4318H10.5Z"
                fill="#808080"
              />
            </svg>
          </Tooltip>
        </div>
        <Button
          variant="shadow"
          onClick={getRecipesByIngs}
          color="success"
          className="text-white  font-semibold"
        >
          Find my recipes!
        </Button>
        <div className="flex items-center space-x-2 w-full">
          <Input
            fullWidth
            color="success"
            size="lg"
            placeholder="Add an ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            color="success"
            onClick={addIngredient}
            className="flex-none normal-case h-12 text-white font-bold"
          >
            Add
          </Button>
        </div>
        <ul className="w-full">
          {ingredients.length > 0 &&
            ingredients.map(({ id, name, isDeleting }) => (
              <li
                key={id}
                className={`flex justify-between items-center bg-green-100 p-2 rounded-md my-2 ${
                  isDeleting ? "animate-fadeOut" : "animate-fadeIn"
                }`}
              >
                {name}
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => deleteIngredient(id)}
                  className="normal-case"
                >
                  Delete
                </Button>
              </li>
            ))}
        </ul>
        <Toaster />
      </div>

      <ResultsIngs
        recipes={recipes}
        recipeanaly={isAnalysing}
        dbSavedRecipes={savedRecipes}
      />
      </div>
    </>
  );
};

export default IngredientInput;
