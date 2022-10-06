import React from 'react';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups/index.js';


const Dropdown = ({ id, label, size, state, setState, options, getter, helperText, tooltip, customFunction, color, icon, required }) => {

    const handleValidation = (event) => {
        if (!event.target.value) {
            setState({ ...state, error: true });
        } else {
            setState({ ...state, error: false });
        }
    }

    return (
        <div className='flex gap-2'>
            <FormControl fullWidth required={required}>
                <Autocomplete
                    id={id} name={id}
                    value={state.value}
                    onChange={(_, newValue) => setState(newValue)}
                    onBlur={handleValidation} onKeyUp={handleValidation}
                    options={options}
                    getOptionLabel={(option) => option[getter] || ''}
                    isOptionEqualToValue={(option, value) => option[getter] === value[getter]}
                    renderInput={(params) => <TextField {...params} error={state.error} label={label} placeholder={label} size={size ? size : 'normal'} variant='outlined' helperText={state.error && helperText} />}
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