interface Recipe {
    id: number;
    name: string;
    cookTime: number;
    Ingredients: Ingredient[];
    imageUrl?: string;
}

interface Ingredient {
    id: number;
    name: string;
}

interface NoMatchIngredients {
    
}