import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import {removeSavedRecipe} from '@/database_actions/users';



export async function POST(request: NextRequest) {
    try{
        const { id } = await request.json();
        const session = await getServerSession(authOptions)
        if(session && session?.user){
            const res = await removeSavedRecipe(id,session.user.email)
            if(res){
                return NextResponse.json({ status: 200 });
            }else{
                return NextResponse.json({ message: "An error occurred while saving favourited recipe", status: 500 });
            }
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while saving favourited recipe", status: 500 });
    }
}