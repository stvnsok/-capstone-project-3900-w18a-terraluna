import { EmptyApiResponse } from "./AuthApiResponse";

interface CopyRecipeApiResponse extends EmptyApiResponse {}

interface DeleteRecipeApiResponse {
    data: {
        id: number;
    }
}

interface NoMatchFrequencyApiResponse {
    data: {
        ingredients: Ingredient[]
    }
}

interface RecipesRecipeContributorsApiResponse {
    data : {
        recipes: Recipe[]
    }
}

interface NewRecipeApiResponse {
    data: {
        id: number;
        name: string;
        description: string;
        ingredients: Ingredient[];
        mealType: mealType[];
    
    }
}