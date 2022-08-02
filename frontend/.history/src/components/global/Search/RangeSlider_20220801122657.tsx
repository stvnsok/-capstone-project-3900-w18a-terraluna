import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export const RangeSlider = () => {
    const [value, setValue] = useState<number>(120);

    const marks = [
        {
          value: 0,
          label: '0°C',
        },
        {
          value: 15,
          label: '20°C',
        },
        {
          value: 30,
          label: '37°C',
        },
        {
          value: 45,
          label: '100°C',

        },
        {
            value: 60,
            label: '120°C',
        }
      ];
      
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
      };

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