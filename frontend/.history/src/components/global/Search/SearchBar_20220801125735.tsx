import React, { useState } from 'react';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Button from './Button'
import Paper from '@mui/material/Paper';

export default function SearchBar (){

    const [searchResults, setSearchResults] = useState([]);
    return (
        <Paper
            component='form'
            sx = {{ display: 'flex', alignItems: 'center', padding: '2px 4px', height: 'fit-content', width: 1000, marginTop: '0.5rem'} }
        >
            <InputBase
                placeholder='Search for Ingredients or Recipes'
                inputProps = {{ 'aria-label': 'search' }}
                
            />
        </Paper>
    )
}