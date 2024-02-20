import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import recipeModel from "@/models/recipeModel";
 connectToDb();


export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions)
        if(session && session?.user){
            const { id, userRating, rating, numOfRatings} = await request.json();
            const newRating = ((rating * numOfRatings) + userRating) / (numOfRatings + 1)
            const result = await recipeModel.updateOne({ _id: id }, { $set: { rating: newRating, numOfRatings: numOfRatings+1 } });
            return NextResponse.json({message:newRating, status: 200 }); 
        }else{
            return NextResponse.json({ message: "An error occurred while updating rating", status: 500 });
        }
         
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while updating rating", status: 500 });
    }
}