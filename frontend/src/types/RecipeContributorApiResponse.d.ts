import { EmptyApiResponse } from "./AuthApiResponse";

interface CopyRecipeApiResponse extends EmptyApiResponse {}

interface DeleteRecipeApiResponse {
    id: number;
}

interface NoMatchFrequencyApiResponse {
    ingredientSets: NoMatchIngredients[]
}

interface RecipesRecipeContributorsApiResponse {
    recipes: Recipe[]
}

interface NewRecipeApiResponse {
    recipe: Recipe
}