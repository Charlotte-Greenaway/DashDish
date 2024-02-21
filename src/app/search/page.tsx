"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pagination } from "@nextui-org/react";
import RecipeWidget from "../components/recipeWidget";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

interface Recipe {
  _id: number;
  recipeId: string;
  recipeTitle: string;
  rating: number;
  image: {
    data: string;
  };
  summary: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");
  const [diet, setDiet] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]); // Store all fetched recipes here
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [analysing, setIsAnalysing] = useState<boolean>(false);

  const RECIPES_PER_PAGE = 9; // Number of recipes to show per page
  const resultsRef: any = useState(null);
  useEffect(() => {
    if (resultsRef.current && (recipesToShow.length > 0 || analysing)) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [analysing]);
  // Slice the portion of recipes to display based on the current page
  const recipesToShow = allRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );
  const toggleAllergen = (allergen: string) => {
    setAllergens((prevAllergens) => {
      if (prevAllergens.includes(allergen)) {
        return prevAllergens.filter((a) => a !== allergen);
      } else {
        return [...prevAllergens, allergen];
      }
    });
  };

  const findRecipes = async () => {
    setIsAnalysing(true);
    try {
      const res = await axios.post("/api/recipes/getRecipesByParams", {
        searchTerm,
        cuisine,
        diet,
        mealType,
        allergens,
      });

      if (res.data.status === 200) {
        setAllRecipes(res.data.message);
        setCurrentPage(1); // Reset to first page for new search results
      } else {
        toast.error("Could not retrieve recipes");
      }
    } catch (error) {
      toast.error("An error occurred while fetching recipes");
      console.error(error);
    } finally {
      setIsAnalysing(false);
    }
  };
  const options = {
    cuisineOptions: [
      "None",
      "Mediterranean",
      "German",
      "Tibetan",
      "International",
      "Jamaican",
      "Spanish",
      "Comfort Food",
      "Irish",
      "European",
      "Mexican",
      "Middle Eastern",
      "Caribbean",
      "Albanian",
      "Chinese",
      "Georgian",
      "Global",
      "French",
      "Indian",
      "Japanese",
      "American",
      "British",
      "Asian",
      "Italian",
      "Alpine",
    ],
    dietOptions: [
      "None",
      "Low carb",
      "Mediterranean",
      "Vegetarian",
      "Dairy Free",
      "Dairy-free",
      "Pescatarian",
      "Low Carb",
      "Paleo",
      "Gluten-Free",
      "Dairy-Free",
      "Keto",
      "Healthy",
      "Sustainable Seafood",
      "vegetarian",
      "gluten-free",
      "Gluten Free",
      "Nut-free",
      "Vegetarian-friendly",
      "Vegan",
    ],
    mealTypeOptions: [
      "None",
      "Drink",
      "Side",
      "Dressing",
      "Dinner",
      "Side dish",
      "Sauce",
      "Spread",
      "Seafood",
      "Main course",
      "Dessert",
      "Condiment",
      "Appetizer",
      "Snack",
      "Teatime",
      "Lunch",
      "Brunch",
      "Finger food",
      "Salad",
      "Main",
      "Breakfast",
      "Entree",
    ],
    allergenOptions: [
      "None",
      "Wheat",
      "Milk",
      "Tree nuts",
      "Shellfish",
      "Almonds",
      "Nuts",
      "Egg",
      "Eggs",
      "Dairy",
      "Sesame",
      "Fish",
      "Gluten",
      "Soy",
    ],
  };

  return (
    <div className="max-w-[1150px] mx-auto p-4 flex flex-col items-center justify-center bg-white">
      <h2 className="text-3xl w-full max-w-3xl text-center md:text-4xl font-bold text-green-900 mb-4 mt-2 shadow-md p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
        Search For Recipes
      </h2>
      <div className="max-w-3xl">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            {options.cuisineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            {options.dietOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            {options.mealTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <fieldset>
            <legend className="text-lg font-medium">
              Allergens (exclude):
            </legend>
            <div className="flex justify-evenly items-start flex-wrap gap-4 mt-2">
              {options.allergenOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allergens.includes(option)}
                    onChange={() => toggleAllergen(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          <button
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={findRecipes}
          >
            Search
          </button>
        </div>
      </div>
      <div className="my-4">
        <div
          className="flex flex-col lg:flex-row flex-wrap justify-start items-center"
          ref={resultsRef}
        >
          {recipesToShow.length > 0 && !analysing ? (
            recipesToShow.map((item) => (
              <RecipeWidget key={item._id} recipe={item} />
            ))
          ) : analysing ? (
            <div id="cooking">
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div id="area">
                <div id="sides">
                  <div id="pan"></div>
                  <div id="handle"></div>
                </div>
                <div id="pancake">
                  <div id="pastry"></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="my-4 mx-auto">Search for recipes!</p>
          )}
        </div>
      </div>
      <div className="mx-auto">
        {allRecipes.length > RECIPES_PER_PAGE && (
          <Pagination
            total={Math.ceil(allRecipes.length / RECIPES_PER_PAGE)}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
            loop
            showControls
            color="success"
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Search;
