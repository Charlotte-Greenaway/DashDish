import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import UserModel from "@/models/user-model";
import recipeModel from "@/models/recipeModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
 connectToDb();


export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions)
        if(session && session.user){
            const userDetails = await UserModel.findOne({email:session?.user.email})
            if(userDetails){
                const recipes = await recipeModel.find({ '_id': { $in: userDetails?.savedRecipes } }).select('_id id recipeTitle rating image summary')
                return NextResponse.json({ message:recipes,status: 200 });
            }else{
                return NextResponse.json({ message:"Log in required to access this function",status: 401 });
            }
            
        }else{
            return NextResponse.json({ message:"Log in required to access this function",status: 401 });
        }
        

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message:"Could not get user saved recipes",status: 500 });
    }
}