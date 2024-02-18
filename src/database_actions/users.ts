
import mongoose from 'mongoose';
import { connectToDb } from '@/database_actions/dbConfig';
import UserModel from '@/models/user-model';

connectToDb();

export const handleNewUserReg = async (email:string, name:string) => {
    try{
        
        //check if user exists in mongo db
        const userExists = await UserModel.findOne({email:email});
        //if they do then return
        if (userExists){
            return userExists
        }
        //else create user
        const newUser = new UserModel({
            email:email,
            name:name
        })
        await newUser.save();
        return newUser;
    }catch(error:any){
        throw new Error(error);
    }
}

export const getMongoUserId = async () =>{
    try{
        
        // const userInMongo = await UserModel.findOne({
        //     clerkUserId: loggedInUser?.id,
        // })
        // if(userInMongo) return userInMongo._id;
    }catch(error:any){
        throw new Error (error);
    }
}

export const updatedSavedIngredients = async (ingredients:string[], email:string)=>{
    
    const result = await UserModel.updateOne({ email: email }, { $set: { savedIngredients: ingredients } });
    return result;
}

export const updatedSavedRecipe = async (recipe:string, email:string)=>{
    
    const result = await UserModel.updateOne(
        { email:email },
        { $addToSet: { savedRecipes: recipe } }
      );
      return result;
}

export const removeSavedRecipe = async (recipe: string, email:string) => {
  
    const result = await UserModel.updateOne(
      { email:email },
      { $pull: { savedRecipes: recipe } }
    );
    return result;
  
  };

