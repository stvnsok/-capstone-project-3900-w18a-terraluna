import Box from '@mui/material/Box';
import React from 'react';
// import Button from "../Button";
import { RangeSlider } from './RangeSlider';

let mealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
let Diet = ['Vegan', 'Vegetarian', 'Pescetarian', 'Paleo', 'Omnivore', 'Other'];
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