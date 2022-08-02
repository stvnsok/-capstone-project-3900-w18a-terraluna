import Box from '@mui/material/Box';
import React from 'react';
import Button from "../Button";
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = React.useState<string>('');
    const [diet, setDiet] = React.useState<string[]>([]);

    MealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            {MealType.map((type) =>  (
                <Button
                    onClick = {() => setMealType(type)} 
                >{type}
                </Button>
            ))}
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}