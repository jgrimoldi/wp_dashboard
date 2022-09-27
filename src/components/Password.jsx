import React, { useState } from 'react'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const Password = ({ id, label, css, required }) => {

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setPassword(event.target.value);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className={`flex gap-2 ${css}`}>

            <FormControl variant='outlined' fullWidth required={required}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <OutlinedInput
                    id={id} name={id}
                    type={showPassword ? 'text' : 'password'}
                    label={label} placeholder={label}
                    // onBlur={(e) => validate(e)}
                    // onKeyUp={(e) => validate(e)}
                    onChange={handleChange}
                    value={password}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton aria-label='Mostrar/Ocultar Contraseña'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'>{showPassword ? <BsEye /> : <BsEyeSlash />}
                            </IconButton>
                        </InputAdornment>
                    } />
            </FormControl>
        </div>
    )
}

export default Password