import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/authOptions";
import React from 'react';
import IngredientInput from './components/inputIngredients';
import { connectToDb } from "@/database_actions/dbConfig";
import UserModel from "@/models/user-model";
// Define a type for the ingredient object
connectToDb();




// Home component that uses InputIngredients
const Home: React.FC = async() => {
  const session = await getServerSession(authOptions)
  if(session && session.user){
    const userExists = await UserModel.findOne({ email: session.user.email });
    const ingredients:string[] = (userExists)?userExists?.savedIngredients: [];

    return (
      <>
        <IngredientInput initialIngredients={ingredients}/>
      </>
    );
  }else{
    return (
      <>
        <IngredientInput initialIngredients={[]}/>
      </>
    );
  }
  
  
};

export default Home;