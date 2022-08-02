import Box from '@mui/material/Box';
import React from 'react';
import Button from "../Button";
import { RangeSlider } from './RangeSlider';

let MealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const Filters = () => {
    const [mealType, setMealType] = React.useState<string[]>([]);
    const [diet, setDiet] = React.useState<string[]>([]);
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            {MealType.map((type) =>  (
                <Button
                    onClick = {setMealType(type)} 
                >{type}
                </Button>
            ))}
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}