import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export const RangeSlider = () => {
    const [value, setValue] = useState<number []>([0, 120]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Slider
                value={value}
                onChange= {handleChange}
                getAriaLabel = {() => 'Cook Time'}
            />
        </Box>
    )
}