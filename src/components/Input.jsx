import React from 'react'
import { TextField } from '@mui/material';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const Input = ({ id, type, value, label, size, tooltip, customFunction, color, icon, css, required }) => {
    return (
        <div className={`flex gap-2 ${css}`}>
            <TextField
                id={id} name={id}
                type={type ? type : 'text'} defaultValue={value ? value : ''}
                label={label} placeholder={label}
                size={size ? size : 'normal'}
                variant='outlined'
                required={required}
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