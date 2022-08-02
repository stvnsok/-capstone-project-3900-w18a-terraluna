import Box from '@mui/material/Box';
import React from 'react';
// import Button from "../Button";
import { RangeSlider } from './RangeSlider';

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
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}