import React from 'react';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Button from './Button'
import Paper from '@mui/material/Paper';

export default function SearchBar (){
    return (
        <Paper
            component='form'
            sx = {{ display: 'flex', alignItems: 'center', padding: '0.5rem', height: 'fit-content', width: 1000 } }
        >
            <InputBase
                placeholder='Search for Ingredients or Recipes'
                inputProps = {{ 'aria-label': 'search' }}
            />
        </Paper>
    )
}