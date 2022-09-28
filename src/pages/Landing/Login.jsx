import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Form, Input, Password, Button } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';

const Login = () => {
    const { setAuth } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleLogin = () => {
        setAuth({});
        navigate(from, { replace: true });
    }

    return (
        <div>
            <h1>Login</h1>
            <Form title='Inicia sesión en tu cuenta'>
                <Input id='email' type='email' label='Correo electrónico' />
                <Password id='password' label='Contraseña' color='purple' />
                TODO: Agregar reCaptcha
                <div className='flex flex-col gap-2'>
                    <Button customFunction={handleLogin} borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' width='full' height={true} />
                    <NavLink to='/recuperacion' key='forgotPassword'>
                        <span style={{ color: 'blue' }} className='text-14'>¿Olvidaste tu contraseña?</span>
                    </NavLink>
                </div>
            </Form>
        </div>
    )
}

export default Login