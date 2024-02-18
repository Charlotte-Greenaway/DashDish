import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import recipeModel from "@/models/recipeModel";

connectToDb();

export async function POST(request: NextRequest) {
  const { ingredients } = await request.json();
  try {
    const query = {
      cleanIngredients: { $regex: ingredients.join("|"), $options: "i" },
    };

    const recipes = await recipeModel
      .aggregate([
        {
          $match: query,
        },
        {
          $addFields: {
            ingredientMatches: {
              $size: {
                $filter: {
                  input: "$cleanIngredients",
                  as: "ingredient",
                  cond: {
                    $in: ["$$ingredient", ingredients],
                  },
                },
              },
            },
          },
        },
        {
          $sort: {
            ingredientMatches: -1,
          },
        },
        {
          $limit: 9,
        },
        {
          $project: {
            recipeTitle: 1,
            image: 1,
            summary: 1,
            cleanIngredients: 1,
            _id: 1,
            diets:1
          },
        },
      ])
      .exec();

    const ingredientMatch = recipes.map((item: any) => {
      const p = { ...item };
      const missingIngs: any[] = [];
      const matchedIngs: any[] = [];
      item.cleanIngredients.map((ing: string) => {
        var found = false;
        ingredients.map((userIng: string) => {
          if (ing.includes(userIng)) {
            matchedIngs.push(ing);
            found = true;
          }
        });
        if (found == false) {
          missingIngs.push(ing);
        }
      });

      p.missingIngs = missingIngs;
      p.matchedIngs = matchedIngs;
      return p;
    });
    const response =
      ingredientMatch.length > 0 ? ingredientMatch : ["No recipes"];
    return NextResponse.json({ message: response, status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while fetching recipes",
      status: 500,
    });
  }
}
