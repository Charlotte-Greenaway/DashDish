import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import recipeModel from "@/models/recipeModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authOptions";
import UserModel from "@/models/user-model";

connectToDb();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { id, missingIngs } = await request.json();
    const docs = await recipeModel.findOne({ _id: id });

    if (docs) {
      const {
        _id,
        recipeTitle,
        summary,
        ingredients,
        cleanIngredients,
        instructions,
        diets,
        allergens,
        winePairings,
        mealType,
        cuisine,
        timeInHours,
        image,
      } = docs;
      const missingIngsArr = (missingIngs==="No Ingredients")?[]:missingIngs.split(",");
      const matchedIngsArr: string[] = [];
      if (missingIngs !== "No Ingredients") {
        cleanIngredients.forEach((ing: string) => {
          if (!missingIngsArr.includes(ing)) {
            matchedIngsArr.push(ing);
          }
        });
      }else if(session && session?.user){
        const userDetails = await UserModel.findOne({email:session?.user.email});
        if(userDetails){

          const missingIngs: any[] = [];
          const matchedIngs: any[] = [];
          cleanIngredients.map((ing: string) => {
            var found = false;
            userDetails.savedIngredients.map((userIng: string) => {
              if (ing.includes(userIng) || userIng.includes(ing)) {
                matchedIngs.push(ing);
                found = true;
              }
            });
            if (found == false) {
              missingIngs.push(ing);
            }
          });
    
          missingIngsArr.push(...missingIngs) ;
          matchedIngsArr.push(...matchedIngs);
        }
      }
    

      return NextResponse.json({
        message: docs,
        missingIngs: missingIngsArr,
        matchedIngs: matchedIngsArr,
        status: 200,
      });
    } else {
      return NextResponse.json({ message: "Recipe not found", status: 404 });
    }
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while fetching recipe",
      status: 500,
    });
  }
}
