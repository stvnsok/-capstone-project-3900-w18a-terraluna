import React, { useState, useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Button from './Button'
import Paper from '@mui/material/Paper';
// import IngredientSearchResult from './IngredientSearchResult';

export default function SearchBar (){

    const [searchResults, setSearchResults] = useState<string[]>();
    const [search, setSearch] = useState<string>();

    useEffect(() => {
        if (!search) return setSearchResults([]);
        /*
            make API call to set search values

        */

    }, [search]);
    return (
        <Paper
            component='form'
            sx = {{ display: 'flex', alignItems: 'center', padding: '2px 4px', height: 'fit-content', width: 1000, marginTop: '0.5rem'} }
        >
            <InputBase
                placeholder='Search for Ingredients'
                inputProps = {{ 'aria-label': 'search' }}
                value = {search}
                onChange = {e => setSearch(e.target.value)}
                
            />
            {/* map search results and pass it to IngredientSearchResult which is a function that displays each result in a dropdown*/}
            <div>
                {/* {searchResults.map((i) => ( 
                    <IngredientSearchResult 
                        ingredient = {i.name}  
                    />
                ))} */}
            </div>
        </Paper>
    )
}