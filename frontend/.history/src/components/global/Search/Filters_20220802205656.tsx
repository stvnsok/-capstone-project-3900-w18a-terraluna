import Box from '@mui/material/Box';
import React, { useState }from 'react';
import Button from '@mui/material/Button';
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = useState<string>('');
    const [diet, setDiet] = useState<string[]>([]);
    const [flag, handleFlag] = useState<boolean>(false); 

    const handleClick = () => {
        setFlag(!flag);
    };

    let MealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    let diet = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal']
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
                    color = {flag ? 'primary' : 'default'} 
                >{type}
                </Button>
            ))}

            {diet.map((d) => (
                <Button
            ))}
            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}