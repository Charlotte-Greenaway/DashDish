
import mongoose from "mongoose";
const recipeSchema = new mongoose.Schema(
  {
    id:{
        type: Number,
        required: true,
        unique: true,
    },
    recipeTitle:{
        type: String,
        required: true,
        unique: false,
    },
    summary:{
        type: String,
        required: true,
        unique: false,
    },
    ingredients:{
        type: Array,
        required: true,
        unique: false,
    },
    cleanIngredients:{
        type: Array,
        required: true,
        unique: false,
    },
    instructions:{
        type: Array,
        required: true,
        unique: false,
    },
    diets:{
        type: Array,
        required: true,
        unique: false,
    },
    allergens:{
        type: Array,
        required: true,
        unique: false,
    },
    winePairings:{
        type: Array,
        required: true,
        unique: false,
    },
    mealType:{
        type: Array,
        required: true,
        unique: false,
    },
    cuisine:{
        type: Array,
        required: true,
        unique: false,
    },
    timeInHours:{
        type:Number,
        required: true,
        unique: false,
    },
    image:{
        type: Buffer,
        required: true,
        unique: false,
    },
    equipmentNeeded:{
        type: Array,
        required: true,
        unique: false,
    },
    rating:{
        type:Number,
        default:0
    },
    numOfRatings:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["recipes"]) {
  delete mongoose.models["recipes"];
}

const recipeModel = mongoose.model("recipes",recipeSchema);
export default recipeModel;