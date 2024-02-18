import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/database_actions/dbConfig";
import UserModel from "@/models/user-model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
 connectToDb();


export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions)
        if(session && session.user){
            const userDetails = await UserModel.findOne({email:session?.user.email})
            if(userDetails){
                const returnDetails ={
                    name:userDetails.name,
                    email:userDetails.email,
                    savedRecipes:userDetails.savedRecipes,
                    userCreated:userDetails.createdAt,
                }
                return NextResponse.json({ message:returnDetails,status: 200 });
            }else{
                return NextResponse.json({ message:"Could not get user details",status: 500 });
            }
            
            
        }else{
            return NextResponse.json({ message:"Could not get user details",status: 500 });
        }
        

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message:"Could not get user details",status: 500 });
    }
}