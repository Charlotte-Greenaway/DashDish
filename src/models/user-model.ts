import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name:{
      type:String,
      required: true,
      default:""
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    savedIngredients: {
      type: Array,
      default:[]
    },
    reviews: {
      type: Array,
      default:[]
    },
    savedRecipes: {
      type: Array,
      default:[]
    },
    shoppingList: {
      type: Array,
      default:[]
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["users"]) {
  delete mongoose.models["users"];
}

const UserModel = mongoose.model("users",userSchema);
export default UserModel;