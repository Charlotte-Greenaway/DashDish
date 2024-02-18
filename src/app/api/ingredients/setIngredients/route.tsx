import { NextResponse, NextRequest } from "next/server";
import { updatedSavedIngredients } from "@/database_actions/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";



export async function POST(request: NextRequest) {
    try{
        const { ingredients } = await request.json();
        const session = await getServerSession(authOptions)
        const response = await updatedSavedIngredients(ingredients,session.user.email)
        if(response.modifiedCount<1){
            return NextResponse.json({ message: "Could not update ingredients", status: 500 });
        }else{
            return NextResponse.json({ status: 200 });
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while saving ingredients", status: 500 });
    }
}