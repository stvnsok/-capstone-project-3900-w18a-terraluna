interface Recipe {
    id: number;
    name: string;
    cookTime: number;
    imageUrl?: string;
}

interface Ingredient {
    id: number;
    name: string;
}

interface NoMatchIngredients {
    
}