import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export const RangeSlider = () => {
    const [value, setValue] = useState<number>(120);

    const time = [
        {
          value: 0,
          label: '',
        },
        {
          value: 30,
          label: '30min',
        },
        {
            value: 60,
            label: '1hr',
        },
        {
            value: 90,
            label: '1.5hr',
        },
        {
            value: 120,
            label: '2hr+',
        }
      ];
      
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
      };

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                value={value}
                onChange= {handleChange}
                getAriaLabel = {() => 'Cook Time'}
                step = {5}
                marks = {time}
            />
        </Box>
    )
}