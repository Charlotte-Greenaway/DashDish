"use client";
import React, { useState, useEffect, useRef} from "react";
import RecipeWidget from "../components/recipeWidget";
import toast,{Toaster} from "react-hot-toast";
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [analysing, setIsAnalysing] = useState<boolean>(false);
    const resultsRef:any = useState(null)
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [analysing]);
  const findRecipes = async () => {
    setIsAnalysing(true);
    //axios post
    const res = await axios.post("/api/recipes/getRecipesByParams",{
        searchTerm:searchTerm,
        cuisine:cuisine,
        diet:diet,
        mealType:mealType,
        allergens:allergens
    })
    console.log(res.data)
    if(res.data.status==200){
        setRecipes(res.data.message)
    }else{
        toast.error("could not retrieve recipes")
    }
    
    setIsAnalysing(false);
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

  const toggleAllergen = (allergen: string) => {
    setAllergens((prevAllergens) => {
      if (prevAllergens.includes(allergen)) {
        return prevAllergens.filter((a) => a !== allergen);
      } else {
        return [...prevAllergens, allergen];
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Search For Recipes
      </h2>
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
          <legend className="text-lg font-medium">Allergens (exclude):</legend>
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
      <div className="flex flex-col lg:flex-row flex-wrap justify-start items-center" ref={resultsRef}>
        {recipes.length > 0 && !analysing
          ? recipes.map((item) => <RecipeWidget key={item._id} recipe={item} />)
          : (analysing)?(
              <>
                <div className="show">
                  <span className="loader mx-auto"></span>
                  <span className="loader2">Loading</span>
                </div>
              </>
            ):(
                <></>
            )
            }
      </div>
      <Toaster/>
    </div>
  );
};

export default Search;
