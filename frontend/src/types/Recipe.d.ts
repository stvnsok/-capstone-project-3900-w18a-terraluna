interface Recipe {
    id: number;
    name: string;
    cookTime: number;
    description?: string;
    imageUrl?: string;
    mealType: string[];
    dietType: string[];
    status: "Draft" | "Published" | "Template";
}

interface RecipeDetails extends Recipe {
    ingredients: (Ingredient & {
        units?: string,
        quantity?: number
    })[];
    steps: {
        instruction: string,
        videoUrl?: string
    }[];
    reviews: {
        stars: [1,2,3,4,5][number];
        review: string;
    }[]
}

interface Ingredient {
    id: number;
    name: string;
}

interface NoMatchIngredients {
    ingredients: Ingredient[]
}