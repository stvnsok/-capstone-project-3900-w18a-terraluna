import React from 'react';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Button from './Button'
import Paper from '@mui/material/Paper';

export default function SearchBar (){
    return (
        <Paper>
            <InputBase
                placeholder='Search'
            />
        </Paper>
    )
}