import { api } from "../api"
import { CopyRecipeApiResponse, DeleteRecipeApiResponse, NoMatchFrequencyApiResponse, RecipesRecipeContributorsApiResponse } from "../types/RecipeContributorApiResponse"

export const createRecipeFromTemplate = (
    id: number
): Promise<CopyRecipeApiResponse> => {
    return (api.post(`/recipe_contributors/recipe/${id}/copy`))
}

export const deleteRecipe = (
    id: number
): Promise<DeleteRecipeApiResponse> => {
    return (api.delete(`/recipe_contributors/recipe/${id}/delete`))
}

export const getNoRecipeMatchRecipes = (
): Promise<NoMatchFrequencyApiResponse> => {
    return (api.get(`/recipe_contributors/no_match_frequency`))
}

export const getRecipesRecipeContributors = (
        pageNumber: number
    ): Promise<RecipesRecipeContributorsApiResponse> => {
    return (api.get('/recipe_contributors/recipes', { params: { pageNumber: pageNumber } }))
}
