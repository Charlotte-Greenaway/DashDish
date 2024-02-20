import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDb } from "@/database_actions/dbConfig";
import { removeSavedItem } from "@/database_actions/users";
import UserModel from "@/models/user-model";
connectToDb();


export async function POST(request: NextRequest) {
    try{
        const { item } = await request.json();
        const session = await getServerSession(authOptions)
        if(session && session?.user){
            const user= await UserModel.findOne({email:session.user.email})
            if(user){
                const hasUpdated = await removeSavedItem(item,session.user.email)
                if(hasUpdated){
                    return NextResponse.json({ status: 200 });
                }else{
                    return NextResponse.json({ message: "An error occurred while removing item", status: 500 });
                }
                
            }else{
                return NextResponse.json({ message: "An error occurred while removing item", status: 500 });
            }
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while saving favourited recipe", status: 500 });
    }
}