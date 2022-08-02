import Box from '@mui/material/Box';
import React from 'react';
// import Button from "../Button";
import { RangeSlider } from './RangeSlider';

let mealTypeList = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
let DietList = ['Vegan', 'Vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal'];

export const Filters = () => {
    const [mealType, setMealType] = React.useState<string>('');
    const [diet, setDiet] = React.useState<string>('');
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            {mealType.map((i) => ( 
                <Button>{i}</Button>
                ))}
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}