import React, { useState } from 'react';
import { FormControl, InputLabel, Select, OutlinedInput } from '@mui/material';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';

export default function Multiselect() {
    const [filterName, setFilterName] = useState<string[]>([]);

    return (
        <React.Fragment>
            <FormControl variant="outlined" style={{ width: '100%' }}>
                <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
                <Select
                    value = {filterName}
                    input = {<OutlinedInput name="age" id="outlined-age-native-simple" />}
                    renderValue = {(selected) => (
                        <Box>

                        </Box>
                    )}
                />


            </FormControl>
        </React.Fragment>
    )
}