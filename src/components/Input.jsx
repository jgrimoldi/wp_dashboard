import React from 'react'
import { TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Input = ({ id, type, label, size, tooltip, customFunction, color, icon, css, required, state = { value: '', error: null }, setState, regEx = '', helperText }) => {

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
                id={id} name={id}
                type={type ? type : 'text'} value={state.value}
                onChange={handleChange} onKeyUp={handleValidation} onBlur={handleValidation}
                label={label} placeholder={label}
                size={size ? size : 'normal'}
                variant='outlined'
                required={required}
                error={state.error}
                helperText={state.error && helperText}
                fullWidth
            />
            {tooltip ?
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

export default Input