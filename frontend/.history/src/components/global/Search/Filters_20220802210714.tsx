import Box from '@mui/material/Box';
import React, { useState }from 'react';
import Button from '@mui/material/Button';
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = useState<string>('');
    const [diet, setDiet] = useState<string[]>([]);
    const [flag, setFlag] = useState<boolean>(true); 

    const handleClick = () => {
        setFlag(!flag);
    };

    let mealTypeList = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    let dietTypeList = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal']
    return (
        <Box sx={{ 
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
        }}>
            <RangeSlider />
            <div>

                {mealTypeList.map((type) =>  (
                    <Button
                        onClick = {() => {setMealType(type); handleClick();}}
                        color = {flag ? 'primary' : 'default'}
                    >{type}
                    </Button>
                ))}
            </div>
            <div>

                {dietTypeList.map((type) =>  (
                    <Button
                        onClick = {() => {setDiet(type); handleClick();}}
                        // color = {flag ? 'primary' : 'default'} 
                    >{type}
                    </Button>
                ))}
            </div>

            {/* <Button>Clear</Button> */}
        </Box>
    
    )
}