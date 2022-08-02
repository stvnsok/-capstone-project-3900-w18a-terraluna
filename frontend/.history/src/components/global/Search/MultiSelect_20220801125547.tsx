import React, { useState } from 'react';
import { FormControl, InputLabel, Select, OutlinedInput, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';

export default function Multiselect() {
    const [filterName, setFilterName] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event: SelectChangeEvent<typeof filterName> ) => {
        const { target: { value }} = event;
        setFilterName(
            typeof value === 'string' ? value.split(',') : value
        );
    }

    return (
        <React.Fragment>
            <FormControl variant="outlined" style={{ width: '100%' }}>
                <InputLabel htmlFor="multi">Multi-Select</InputLabel>
                <Select
                    value = {filterName}
                    onChange = {handleChange}
                    input = {<OutlinedInput label = 'chip' id="select-multi" />}
                    renderValue = {(selected) => (
                        <Box sx = {{ dispay: 'flex', flexwrap: 'wrap', gap:0.5}}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} /> 
                            ))}
                        </Box>
                    )}
                />


            </FormControl>
        </React.Fragment>
    )
}