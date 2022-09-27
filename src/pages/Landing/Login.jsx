import React from 'react';
import { useAuthContext } from '../../contexts/ContextAuth';

const Login = () => {
    const { setAuth } = useAuthContext();

    const handleLogin = () => {
        setAuth({
            id: 1,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjY0Mjk1NzkxLCJleHAiOjE2NjQzMDI5OTF9.3OTo0HADO6LGQvesOepRK9YFwD_MnWF-n0g_gwYRVf4",
            email: 'email@example.com',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 2,
            fk_empresa: 112345678,
            fk_theme: 1,
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Iniciar sesion</button>
        </div>
    )
}

export default Login