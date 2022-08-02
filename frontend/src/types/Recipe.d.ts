interface Recipe {
    id: number;
    name: string;
    cookTime: number;
    imageUrl?: string;
    mealType: string[];
    dietType: string[];
}

interface Ingredient {
    id: number;
    name: string;
}

interface NoMatchIngredients {
    ingredients: Ingredient[]
}