import React, { useState } from 'react'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';

const Password = ({ id, label, css, color, required, customFunction, state = { value: '', error: null }, setState, regEx = '', helperText }) => {
    const { themeColors } = useStateContext();
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
            <FormControl variant='outlined' error={state.error} fullWidth required={required}
                sx={{
                    input: {
                        color: themeColors.highEmphasis
                    },
                    '& input': { textTransform: 'capitalize' },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: themeColors.secondary,
                        }
                    },
                    '& label': {
                        color: themeColors.mediumEmphasis,
                        '&.Mui-focused': {
                            color: themeColors.secondary,
                        }
                    }
                }}
            >
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <OutlinedInput
                    id={id} name={id}
                    type={showPassword ? 'text' : 'password'}
                    label={label} placeholder={label}
                    onChange={handleChange} onBlur={handleValidation} onKeyUp={handleValidation}
                    value={state.value}
                    className='bg-white dark:bg-secondary-dark-bg'
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