import React, { useState, createRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import zenet from '../data/zenet.jpg';
import { regEx } from '../data/dummy';
import { Input, Password, Button, LoadingSpinner, ErrorLabel } from '.';
import { loginUser } from '../services/AuthService';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import ReCAPTCHA from 'react-google-recaptcha';

const Navbar = () => {
    const { loginNavbar, themeColors } = useStateContext();
    const { setAuth } = useAuthContext();
    const captcha = createRef();
    const [navEmail, setNavEmail] = useState({ value: '', error: null });
    const [navPassword, setNavPassword] = useState({ value: '', error: null });
    const [navValidForm, setNavValidForm] = useState({ value: '', error: null });
    const [loading, setLoading] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = '/ups';
    const validToken = location.state?.from?.pathname || '/dashboard';

    function redoCaptcha() {
        captcha.current.reset();
        captcha.current.execute();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const captchaValue = captcha.current.execute();
        captchaValue
            .then(response => handleNavLogin(response))
            .catch(error => console.log('error', error))
    }

    const handleNavLogin = (captchaValue) => {
        if (captchaValue) {
            if (navEmail.error === false && navPassword.error === false) {
                setLoading(true);
                loginUser(navEmail.value, navPassword.value)
                    .then(response => {
                        if (response?.data?.user?.validateAccount === false) {
                            setAuth({ notValid: response.data });
                            navigate(from, { replace: true });
                        } else {
                            setAuth(response.data);
                            localStorage.setItem('_fDataUser', JSON.stringify(response.data));
                            setNavValidForm({ ...navValidForm, error: false });
                            navigate(validToken, { replace: true });
                        }
                    })
                    .catch(() => {
                        setNavValidForm({ ...navValidForm, value: 'Correo o contraseña incorrectos. Intenta de nuevo.', error: true });
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            } else {
                setNavValidForm({ ...navValidForm, value: 'Correo o contraseña incorrectos. Intenta de nuevo.', error: true });
            }
        } else {
            setNavValidForm({ ...navValidForm, value: 'Por favor complete el captcha antes de continuar.', error: true });
        }
    }

    return (
        <div className='flex justify-between p-3 relative shadow-xl'>
            {loading === true && <LoadingSpinner color={themeColors?.primary} />}
            <NavLink to='/inicio' key='inicio'>
                <div className='flex gap-4 items-center'>
                    <img className='rounded-full w-16 h-16' src={zenet} alt='Logo de Zenet' />
                    <h1 className=' text-4xl uppercase'>Ag Stock</h1>
                </div>
            </NavLink>
            {
                loginNavbar &&
                <div className='flex flex-col gap-1 items-center'>
                    <form onSubmit={handleSubmit} className='flex gap-2'>
                        <Input id='navEmail' type='email' label='Correo electrónico' css='w-60' state={navEmail} setState={setNavEmail} regEx={regEx.email} />
                        <Password id='navPassword' label='Contraseña' color='purple' css='w-60' state={navPassword} setState={setNavPassword} regEx={regEx.password} />
                        <ReCAPTCHA ref={captcha} sitekey='6LeBRkQhAAAAAE4WcBWP3GxOTlkTG7Ev5iTbXTOj' size='invisible' onExpired={() => redoCaptcha} />
                        <Button type='submit' borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' height={true} />
                    </form>
                    <ErrorLabel color={themeColors?.error} >{navValidForm.value}</ErrorLabel>
                </div>
            }
        </div>
    )
}

export default Navbar