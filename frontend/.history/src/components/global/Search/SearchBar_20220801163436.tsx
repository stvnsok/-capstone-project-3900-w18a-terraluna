import React, { useState, useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Button from './Button'
import Paper from '@mui/material/Paper';
// import IngredientSearchResult from './IngredientSearchResult';

export default function SearchBar ({onInput} : {
    onInput: (value: string) => void;
}){
    // const [searchResults, setSearchResults] = useState<string[]>();
    const [searchValue, setSearchValue] = useState<string>('');
    useEffect(() => {
        onInput(searchValue)
    })
    return (
        <Paper
            component='form'
            sx = {{ display: 'flex', alignItems: 'center', padding: '2px 4px', height: 'fit-content', width: 1000, marginTop: '0.5rem'} }
        >
            <InputBase
                placeholder='Search for Ingredients or Recipes'
                inputProps = {{ 'aria-label': 'search' }}
                value = {searchValue}
                onChange = {e => setSearchValue(e.target.value)}
                
            />
            
            {/* <div>
                {searchResults.map((result) => ( 
                    <IngredientSearchResult 
                        ingredient = {result}  
                    />
                ))}
            </div> */}
        </Paper>
    )
}