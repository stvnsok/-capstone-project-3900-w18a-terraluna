import Box from '@mui/material/Box';
import React from 'react';
// import Button from "../Button";
import { RangeSlider } from './RangeSlider';

let mealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
let Diet = ['Vegan', 'Vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal'];

export const Filters = () => {
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            {}
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}