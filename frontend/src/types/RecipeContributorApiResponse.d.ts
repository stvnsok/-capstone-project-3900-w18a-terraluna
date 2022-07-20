import { EmptyApiResponse } from "./AuthApiResponse";

interface CopyRecipeApiResponse extends EmptyApiResponse {}

interface DeleteRecipeApiResponse {
    data: {
        id: number;
    }
}

interface NoMatchFrequencyApiResponse {
    data: {
        ingredientSets: NoMatchIngredients[]
    }
}

interface RecipesRecipeContributorsApiResponse {
    data : {
        recipes: Recipe[]
    }
}