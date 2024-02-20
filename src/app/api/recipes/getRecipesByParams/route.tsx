import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import recipeModel from "@/models/recipeModel";

connectToDb();
interface RecipeQuery {
  recipeTitle?: { $regex: string; $options: string };
  cuisine?: string;
  diet?: string;
  mealType?: string;
  allergens?: {$nin: string[] };
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, cuisine, diet, mealType, allergens } =
      await request.json();

    // Initialize the search query object
    const queryObj: RecipeQuery = {};

    // Add search term to the query object if it exists
    if (searchTerm) {
      queryObj.recipeTitle = { $regex: searchTerm, $options: "i" }; // Case-insensitive regex search
    }

    // Add other filters to the query object if they exist
    if (cuisine) queryObj.cuisine = cuisine;
    if (diet) queryObj.diet = diet;
    if (mealType) queryObj.mealType = mealType;
    if (allergens.length>0) queryObj.allergens = { $nin: allergens }; // Assuming 'allergens' is a comma-separated string

    // Execute the query with the specified projections and aliases
    const recipes = await recipeModel.find(queryObj).select({
      _id: 1, // Include _id
      name: 1, // Include name
      rating: 1, // Include rating
      image: 1, // Include image
      summary: 1, // Include summary
      // Other fields you want to include can be set to 1
    });
    if(recipes){
      return NextResponse.json({
        message: recipes,
        status: 200,
      });
    }else{
      return NextResponse.json({
        message: "Could not find recipes",
        status: 500,
      });
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: "An error occurred while fetching recipes",
      status: 500,
    });
  }
}
