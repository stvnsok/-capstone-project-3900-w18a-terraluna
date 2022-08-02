import Box from '@mui/material/Box';
import React, { useState }from 'react';
import Button from '@mui/material/Button';
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = useState<string>('');
    const [diet, setDiet] = useState<string[]>([]);
    const [flag, setFlag] = useState<boolean>(false); 

    const handleClick = () => {
        setFlag(!flag);
    };

    let mealType = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const diet = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal']
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            <div>

                {MealType.map((type) =>  (
                    <Button
                        onClick = {() => {setMealType(type); handleClick();}}
                        color = "primary"
                    >{type}
                    </Button>
                ))}
            </div>
            <div>

                {MealType.map((type) =>  (
                    <Button
                        onClick = {() => {setMealType(type); handleClick();}}
                        color = {flag ? 'primary' : 'default'} 
                    >{type}
                    </Button>
                ))}
            </div>

            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}