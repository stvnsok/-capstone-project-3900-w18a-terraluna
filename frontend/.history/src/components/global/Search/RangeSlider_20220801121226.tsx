import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export const RangeSlider = () => {
    const [value, setValue] = useState<number []>([0, 120]);

    return (
        <Box sx={{ width: '100%' }}>
            <Slider
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                aria-labelledby="range-slider"
            />
        </Box>
    )
}