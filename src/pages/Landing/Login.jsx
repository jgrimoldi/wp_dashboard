import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import heroImage from '../../data/heroImage.png';
import { regEx } from '../../data/dummy';
import { Form, Input, Password, Button, ErrorLabel, LoadingSpinner, SEO } from '../../components';
import { loginUser } from '../../services/AuthService';
import { useAuthContext } from '../../contexts/ContextAuth';
import { useStateContext } from '../../contexts/ContextProvider';

const Login = () => {
    const { setLoginNavbar, themeColors } = useStateContext();
    const { setAuth } = useAuthContext();
    const captcha = useRef(null);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState({ value: '', error: null });
    const [password, setPassword] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null });
    const [loading, setLoading] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const validToken = location.state?.from?.pathname || '/dashboard';
    const from = '/ups';

    useEffect(() => {
        setLoginNavbar(false);
        setUser(JSON.parse(localStorage.getItem('_fDataUser')));
        if (user !== null) {
            setAuth(user);
            navigate(validToken, { replace: true });
        }
        return () => { setLoginNavbar(null); setUser(null); };
    }, [setLoginNavbar, validToken, navigate, setAuth, user]);

    const handleLogin = async () => {
        if (captcha.current.getValue()) {
            if (email.error === false && password.error === false) {
                setLoading(true);
                await loginUser(email.value, password.value)
                    .then(response => {
                        if (response?.data?.user?.validateAccount === false) {
                            setAuth({ notValid: response.data });
                            navigate(from, { replace: true });
                        } else {
                            setAuth(response.data);
                            localStorage.setItem('_fDataUser', JSON.stringify(response.data));
                            setValidForm({ ...validForm, error: false });
                            navigate(validToken, { replace: true });
                        }
                    })
                    .catch(() => {
                        setValidForm({ ...validForm, value: 'Correo o contrase??a incorrectos. Intenta de nuevo.', error: true });
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            } else {
                setValidForm({ ...validForm, value: 'Parece que el correo o contrase??a no son v??lidos. Vuelve a intentar.', error: true });
            }
        } else {
            setValidForm({ ...validForm, value: 'Por favor complete el captcha antes de continuar.', error: true });
        }
    }

    return (
        <>
            <SEO title='Inicio de sesi??n' description='AG Stock es un software online para inventario de productos para administrar tu local. Planifica, gestiona y antic??pate a la demanda.' />
            <div className='mt-52 md:mt-0'>
                {loading === true && <LoadingSpinner color={themeColors?.primary} />}
                <div className='hidden lg:block absolute w-2/3 h-fit m-auto top-0 bottom-0 z-0'>
                    <img className='w-full max-h-[863px] ' src={heroImage} alt='Trabajadores de reposici??n' />
                </div>
                <div className='relative w-full flex justify-center items-center lg:justify-end lg:px-72 z-50'>
                    <Form title='Inicia sesi??n en tu cuenta'>
                        <Input id='email' type='email' label='Correo electr??nico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo v??lido' />
                        <Password id='password' label='Contrase??a' color={themeColors?.secondary} state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contrase??a v??lida' />
                        <ReCAPTCHA ref={captcha} sitekey='6LeBRkQhAAAAAE4WcBWP3GxOTlkTG7Ev5iTbXTOj' className='m-auto' />
                        <div className='flex flex-col gap-2'>
                            {validForm.error === true && <ErrorLabel color={themeColors?.error}>{validForm.value}</ErrorLabel>}
                            <Button customFunction={handleLogin} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Iniciar sesi??n' width='full' height={true} />
                            <NavLink to='/recuperacion' key='forgotPassword'>
                                <span style={{ color: themeColors?.primary }} className='text-14'>??Olvidaste tu contrase??a?</span>
                            </NavLink>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Login