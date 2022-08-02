import React from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';

export default function RecipeSearchBar () {
    const [search, setSearch] = React.useState<string>();
    return ( 
        <Paper
            component='form'
            sx = {{ display: 'flex', alignItems: 'center', padding: '2px 4px', height: 'fit-content', width: 1000, marginTop: '0.5rem'} }
        >
            <InputBase
                placeholder='Search for Recipes'
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