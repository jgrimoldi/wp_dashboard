import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import heroImage from '../../data/heroImage.png';
import { regEx } from '../../data/dummy';
import { Form, Input, Password, Button, ErrorLabel, LoadingSpinner } from '../../components';
import { loginUser } from '../../services/AuthService';
import { useAuthContext } from '../../contexts/ContextAuth';
import { useStateContext } from '../../contexts/ContextProvider';

const Login = () => {
    const { setLoginNavbar } = useStateContext();
    const { setAuth } = useAuthContext();
    const captcha = useRef(null);
    const [email, setEmail] = useState({ value: '', error: null });
    const [password, setPassword] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null });
    const [loading, setLoading] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        setLoginNavbar(false);
    }, [setLoginNavbar]);

    const handleLogin = async () => {
        if (captcha.current.getValue()) {
            if (email.error === false && password.error === false) {
                setLoading(true);
                await loginUser(email.value, password.value)
                    .then(response => {
                        setAuth(response.data);
                        setValidForm({ ...validForm, error: false });
                    })
                    .catch(() => {
                        setValidForm({ ...validForm, value: 'Correo o contraseña incorrectos. Intenta de nuevo.', error: true });
                    })
                    .finally(() => {
                        navigate(from, { replace: true });
                        setLoading(false);
                    })
            } else {
                setValidForm({ ...validForm, value: 'Parece que el correo o contraseña no son válidos. Vuelve a intentar.', error: true });
            }
        } else {
            setValidForm({ ...validForm, value: 'Por favor complete el captcha antes de continuar.', error: true });
        }
    }

    return (
        <div className='mt-52 md:mt-0'>
            {loading === true && <LoadingSpinner color='blue' />}
            <div className='hidden lg:block absolute w-2/3 h-fit m-auto top-0 bottom-0 z-0'>
                <img className='w-full max-h-[863px] ' src={heroImage} alt='Trabajadores de reposición' />
            </div>
            <div className='relative w-full flex justify-center items-center lg:justify-end lg:px-72 z-50'>
                <Form title='Inicia sesión en tu cuenta'>
                    <Input id='email' type='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' />
                    <Password id='password' label='Contraseña' color='purple' state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' />
                    <ReCAPTCHA ref={captcha} sitekey='6LeBRkQhAAAAAE4WcBWP3GxOTlkTG7Ev5iTbXTOj' className='m-auto' />
                    <div className='flex flex-col gap-2'>
                        {validForm.error === true && <ErrorLabel color='red'>{validForm.value}</ErrorLabel>}
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