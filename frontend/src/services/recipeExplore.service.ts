import { api } from "../api"

export const getRecipes = async (
    ingredients?: number[],
    mealType?: string[],
    dietType?: string[],
    cookTime?: number
): Promise<{recipes: Recipe[]}> => {
    return (await api.get('/recipes', { params: { ingredients: JSON.stringify({ingredients}), mealType: JSON.stringify({mealType}), dietType: JSON.stringify({dietType}), cookTime } })).data
}

export const getRecipesFavourites = async (): Promise<{recipes: Recipe[]}> => {
    return (await api.get('/recipes/favourite')).data
}

export const favoriteRecipe = async (
    id?: number
): Promise<{recipes: Recipe[]}> => {
    return (await api.put(`/recipes/${id}/favourite`)).data
}

export const addReview = async (
    review: string,
    stars: [1,2,3,4,5][number],
    id?: number,
): Promise<{recipes: Recipe[]}> => {
    return (await api.post(`/recipes/${id}/review`, { review, stars })).data
}