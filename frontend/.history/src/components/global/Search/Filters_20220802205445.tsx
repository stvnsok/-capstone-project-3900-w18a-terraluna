import Box from '@mui/material/Box';
import React from 'react';
import Button from '@material-ui/core/Button';
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = React.useState<string>('');
    const [diet, setDiet] = React.useState<string[]>([]);

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