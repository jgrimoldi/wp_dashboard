import React from 'react';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups/index.js';
import { useStateContext } from '../contexts/ContextProvider';

const Dropdown = ({ id, label, size, state, setState, options, getter, helperText, tooltip, customFunction, color, icon, required, disabled }) => {
    const { themeColors } = useStateContext();
    const handleChange = (newValue) => {
        if (!newValue)
            return
        setState(newValue);
    }

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
                    onChange={(_, newValue) => handleChange(newValue)}
                    onBlur={handleValidation} onKeyUp={handleValidation}
                    options={options}
                    getOptionLabel={(option) => option[getter] || ''}
                    isOptionEqualToValue={(option, value) => option[getter] === value[getter]}
                    disabled={disabled}
                    sx={{
                        input: {
                            color: themeColors?.highEmphasis
                        },
                        '& input': { textTransform: 'capitalize' },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: themeColors?.secondary,
                            }
                        },
                        '& label': {
                            color: themeColors?.mediumEmphasis,
                            '&.Mui-focused': {
                                color: themeColors?.secondary,
                            }
                        }
                    }}
                    renderInput={(params) => <TextField {...params} error={state.error} label={label} placeholder={label} size={size ? size : 'normal'} variant='outlined' helperText={state.error && helperText} className='bg-white dark:bg-secondary-dark-bg rounded-md' />}
                />
            </FormControl>
            {tooltip
                ?
                <TooltipComponent content={tooltip} position="TopCenter">
                    <button type='button' onClick={customFunction} style={{ backgroundColor: color }} className='relative p-2 text-white dark:text-black text-2xl rounded-md'>
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