import Box from '@mui/material/Box';
import React, { useState }from 'react';
import Button from '@mui/material/Button';
import { RangeSlider } from './RangeSlider';


export const Filters = () => {
    const [mealType, setMealType] = useState<{ id: number, name: string}[]>([]);
    const [dietType, setDietType] = useState<{ id: number, name: string}[]>([]);
    const [flag, setFlag] = useState<boolean>(true); 

    const handleClick = () => {
        setFlag(!flag);
    };

    const clear = () => {
        setMealType([]);
        setDietType([]);
        setFlag(!flag);
    }

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
                        onClick = {() => { handleClick();}}
                        color = {flag ? 'primary' : 'secondary'}
                    >{type}
                    </Button>
                ))}
            </div>
            <div>

                {dietTypeList.map((type) =>  (
                    <Button
                        onClick = {() => { handleClick();}}
                        color = {flag ? 'primary' : 'secondary'} 
                    >{type}
                    </Button>
                ))}
            </div>

            <Button onClick = {() => clear()}>Clear</Button> 
        </Box>
    
    )
}