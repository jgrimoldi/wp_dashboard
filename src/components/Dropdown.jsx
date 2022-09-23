import React from 'react';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups/index.js';


const Dropdown = ({ id, label, handleChange, value, options, tooltip, customFunction, color, icon }) => {
    return (
        <div className='flex gap-2'>
            <FormControl fullWidth>
                <Autocomplete
                    id={id} name={id}
                    onChange={handleChange}
                    value={value}

                    options={options}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    renderInput={(params) => <TextField {...params} label={label} placeholder={label} size='small' variant='outlined' />}
                />
            </FormControl>
            {tooltip
                ?
                <TooltipComponent content={tooltip} position="TopCenter">
                    <button type='button' onClick={customFunction} style={{ backgroundColor: color }} className='relative p-2 text-white text-2xl rounded-md'>
                        {icon}
                    </button>
                </TooltipComponent>
                :
                <></>
            }

        </div>
    )
}

export default Dropdown