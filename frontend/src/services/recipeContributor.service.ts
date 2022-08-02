import { api } from "../api"
import { CopyRecipeApiResponse, DeleteRecipeApiResponse, NewRecipeApiResponse, NoMatchFrequencyApiResponse, RecipesRecipeContributorsApiResponse } from "../types/RecipeContributorApiResponse"

export const createRecipeFromTemplate = async (
    id: number
): Promise<CopyRecipeApiResponse> => {
    return (await api.post(`/recipe/${id}/copy`)).data
}

export const deleteRecipe = async (
    id: number
): Promise<DeleteRecipeApiResponse> => {
    return (await api.delete(`/recipe/${id}/delete`)).data
}

export const getNoRecipeMatchRecipes = async (
): Promise<NoMatchFrequencyApiResponse> => {
    return (await api.get(`/recipe_contributors/no_match_frequency`)).data
}

export const getRecipesRecipeContributors = async (
        pageNumber: number
    ): Promise<RecipesRecipeContributorsApiResponse> => {
    return (await api.get('/recipe_contributors/recipes', { params: { pageNumber: pageNumber } })).data
}

export const createRecipe = async (
    formData: FormData
): Promise<NewRecipeApiResponse> => {
    return (await api.post('/recipe', formData)).data
}

export const publishRecipe = async (
    id: number
): Promise<NewRecipeApiResponse> => {
    return (await api.patch(`/recipe/${id}/publish`)).data
}

export const getIngredients = async (
    query: string
): Promise<{ ingredients: Ingredient[] }> => {
    return (await api.get('/ingredients', {params: {query}})).data
}



//1. How many recipes does the current ingredient set match - A;
//2. Check for each ingredient that doesn't exist in the ingredient set what makes A + New Recipes Unlocked the greatest.
// New Recipes Unlocked
// NumberOfRecipesMatched(Ingedients[]) => number
// 