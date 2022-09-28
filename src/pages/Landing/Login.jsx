import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import heroImage from '../../data/heroImage.png';
import { regEx } from '../../data/dummy';
import { Form, Input, Password, Button, ErrorLabel } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { useStateContext } from '../../contexts/ContextProvider';

const Login = () => {
    const { setLoginNavbar } = useStateContext();
    const { setAuth } = useAuthContext();
    const [email, setEmail] = useState({ value: '', error: null });
    const [password, setPassword] = useState({ value: '', error: null });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        setLoginNavbar(false);
    }, [setLoginNavbar]);

    const handleLogin = () => {
        setAuth({});
        navigate(from, { replace: true });
    }

    return (
        <div className='mt-52 md:mt-0'>
            <div className='hidden lg:block absolute w-2/3 h-fit m-auto top-0 bottom-0 z-0'>
                <img className='w-full max-h-[863px] ' src={heroImage} alt='Trabajadores de reposición' />
            </div>
            <div className='relative w-full flex justify-center items-center lg:justify-end lg:px-72 z-50'>
                <Form title='Inicia sesión en tu cuenta'>
                    <Input id='email' type='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' />
                    <Password id='password' label='Contraseña' color='purple' state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' />
                    TODO: Agregar reCaptcha
                    <div className='flex flex-col gap-2'>
                        <ErrorLabel color='red'>Correo o contraseña incorrectos. Intenta de nuevo.</ErrorLabel>
                        <Button customFunction={handleLogin} borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' width='full' height={true} />
                        <NavLink to='/recuperacion' key='forgotPassword'>
                            <span style={{ color: 'blue' }} className='text-14'>¿Olvidaste tu contraseña?</span>
                        </NavLink>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login