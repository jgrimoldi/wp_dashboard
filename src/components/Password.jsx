import React, { useState } from 'react'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const Password = ({ id, label, css, color, required, customFunction, state = { value: '', error: null }, setState, regEx = '', helperText }) => {

    const [showPassword, setShowPassword] = useState(null);

    const handleChange = (event) => setState({ ...state, value: event.target.value });
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleValidation = () => {
        if (regEx) {
            if (regEx.test(state.value)) {
                setState({ ...state, error: false });
            } else {
                setState({ ...state, error: true });
            }
        }

        customFunction && customFunction()
    }

    return (
        <div className={`flex gap-2 ${css}`}>
            <FormControl variant='outlined' error={state.error} fullWidth required={required}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <OutlinedInput
                    id={id} name={id}
                    type={showPassword ? 'text' : 'password'}
                    label={label} placeholder={label}
                    onChange={handleChange} onBlur={handleValidation} onKeyUp={handleValidation}
                    value={state.value}
                    className='bg-white'
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                style={{ color }}
                                aria-label='Mostrar/Ocultar Contraseña'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'>
                                {showPassword ? <BsEye /> : <BsEyeSlash />}
                            </IconButton>
                        </InputAdornment>
                    } />
                {state.error && <FormHelperText id={id}>{helperText}</FormHelperText>}
            </FormControl>
        </div>
    )
}

export default Password