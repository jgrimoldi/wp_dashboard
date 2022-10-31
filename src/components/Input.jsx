import React from 'react'
import { TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';

const Input = ({ id, useRef = null, type, label, size, tooltip, customFunction, color, icon, css, required, disabled = false, state = { value: '', error: null }, setState, regEx = '', helperText }) => {
    const { themeColors } = useStateContext();
    const handleChange = (event) => setState({ ...state, value: event.target.value });

    const handleValidation = () => {
        if (regEx) {
            if (regEx.test(state.value)) {
                setState({ ...state, error: false });
            } else {
                setState({ ...state, error: true });
            }
        }
    }

    return (
        <div className={`flex gap-2 ${css}`}>
            <TextField
                id={id} name={id} inputRef={useRef}
                type={type ? type : 'text'} value={state.value}
                onChange={handleChange} onKeyUp={handleValidation} onBlur={handleValidation}
                label={label} placeholder={label}
                size={size ? size : 'normal'}
                variant='outlined'
                required={required}
                error={state.error}
                className='bg-white rounded-md dark:bg-secondary-dark-bg'
                helperText={state.error && helperText}
                fullWidth
                disabled={disabled}
                sx={{
                    input: {
                        color: themeColors?.highEmphasis
                    },
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

            />
            {tooltip ?
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

export default Input