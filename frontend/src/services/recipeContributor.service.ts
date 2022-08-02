import { api } from "../api"
import { CopyRecipeApiResponse, DeleteRecipeApiResponse, NewRecipeApiResponse, NoMatchFrequencyApiResponse, RecipesRecipeContributorsApiResponse } from "../types/RecipeContributorApiResponse"

export const createRecipeFromTemplate = async (
    id: number
): Promise<CopyRecipeApiResponse> => {
    return (await api.post(`/my_recipes/${id}/copy`)).data
}

export const deleteRecipe = async (
    id: number
): Promise<DeleteRecipeApiResponse> => {
    return (await api.delete(`/my_recipes/${id}`)).data
}

export const getNoRecipeMatchRecipes = async (
): Promise<NoMatchFrequencyApiResponse> => {
    return (await api.get(`/recipe_contributors/no_match_frequency`)).data
}

export const getRecipesRecipeContributors = async (
        query?: string
    ): Promise<RecipesRecipeContributorsApiResponse> => {
    return (await api.get('/my_recipes', { params: { query: query ?? '' } })).data
}

export const createRecipe = async (
    formData: FormData
): Promise<NewRecipeApiResponse> => {
    return (await api.post('/my_recipes', formData)).data
}

export const getRecipe = async (
    id: number
): Promise<{recipe: RecipeDetails}> => {
    return (await api.get(`/my_recipes/${id}`)).data
}

export const updateRecipe = async (
    id: number, formData: FormData
): Promise<{recipe: RecipeDetails}> => {
    return (await api.patch(`/my_recipes/${id}`, formData)).data
}

export const publishRecipe = async (
    id: number
): Promise<{recipe: RecipeDetails}> => {
    return (await api.put(`/my_recipes/${id}/publish`)).data
}

export const getIngredients = async (
    query: string
): Promise<{ ingredients: Ingredient[] }> => {
    return (await api.get('/ingredients', {params: {query}})).data
}

export const getSuggestedIngredient = async (
    ingredients: number[]
): Promise<{ ingredients: Ingredient[] }> => {
    return (await api.get('/recipe/ingredient_suggestions', {params: {ingredients: JSON.stringify({ingredients: ingredients})}})).data
}

export const getMedia = async (
    url: string
): Promise<any> => {
    return (await api.get('/uploads', {params: { name: url }})).data
}


//1. How many recipes does the current ingredient set match - A;
//2. Check for each ingredient that doesn't exist in the ingredient set what makes A + New Recipes Unlocked the greatest.
// New Recipes Unlocked
// NumberOfRecipesMatched(Ingedients[]) => number
// 
//1. Find Recipes where current Ingredients is a subset of those recipes' ingredients
//2. Find most common ingre