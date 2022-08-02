import { api } from "../api"

export const getRecipes = async (
    ingredients?: number[]
): Promise<{recipes: Recipe[]}> => {
    return (await api.get('/recipes', { params: { ingredients: JSON.stringify({ingredients}) } })).data
}

export const favoriteRecipe = async (
    id?: number
): Promise<{recipes: Recipe[]}> => {
    return (await api.put(`/recipes/${id}/favourite`)).data
}