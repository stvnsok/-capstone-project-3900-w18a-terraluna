import { api } from "../api"
import { CopyRecipeApiResponse, DeleteRecipeApiResponse, NewRecipeApiResponse, NoMatchFrequencyApiResponse, RecipesRecipeContributorsApiResponse } from "../types/RecipeContributorApiResponse"

export const createRecipeFromTemplate = async (
    id: number
): Promise<CopyRecipeApiResponse> => {
    return (await api.post(`/recipe_contributors/recipe/${id}/copy`)).data
}

export const deleteRecipe = async (
    id: number
): Promise<DeleteRecipeApiResponse> => {
    return (await api.delete(`/recipe_contributors/recipe/${id}/delete`)).data
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
    recipe: Recipe
): Promise<NewRecipeApiResponse> => {
    return (await api.post('/recipe_contributors/new', {params: {recipe: recipe}})).data
}

export const getIngredients = async (
    query: string
): Promise<Ingredient[]> => {
    return (await api.post('/ingredients', {params: {query}})).data
}
