interface Recipe {
    id: number;
    name: string;
    cookTime: number;
    imageUrl?: string;
    mealType: string[];
    dietType: string[];
    status: "Draft" | "Published" | "Template";
}

interface RecipeDetails extends Recipe {
    ingredients: Ingredient[]
}

interface Ingredient {
    id: number;
    name: string;
}

interface NoMatchIngredients {
    ingredients: Ingredient[]
}