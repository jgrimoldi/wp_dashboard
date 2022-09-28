import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import zenet from '../data/zenet.jpg';
import { regEx } from '../data/dummy';
import { Input, Password, Button } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';

const Navbar = () => {
    const { loginNavbar } = useStateContext();
    const { setAuth } = useAuthContext();
    const [navEmail, setNavEmail] = useState({ value: '', error: null });
    const [navPassword, setNavPassword] = useState({ value: '', error: null });
    const [navValidForm, setNavValidForm] = useState({ value: '', error: null });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleNavLogin = () => {
        if (navEmail.error === false && navPassword.error === false) {
            setNavValidForm({ ...navValidForm, error: false });
            setAuth({});
            navigate(from, { replace: true });
        } else {
            setNavValidForm({ ...navValidForm, value: 'Correo o contraseña incorrectos. Intenta de nuevo.', error: true });
        }
    }

    return (
        <div className='flex justify-between p-3 relative shadow-xl'>
            <NavLink to='/inicio' key='inicio'>
                <div className='flex gap-4 items-center'>
                    <img className='rounded-full w-16 h-16' src={zenet} alt='Logo de Zenet' />
                    <h1 className=' text-4xl uppercase'>Ag Stock</h1>
                </div>
            </NavLink>
            {
                loginNavbar &&
                <div className='flex gap-2'>
                    <Input id='navEmail' type='email' label='Correo electrónico' css='w-60' state={navEmail} setState={setNavEmail} regEx={regEx.email} />
                    <Password id='navPassword' label='Contraseña' color='purple' css='w-60' state={navPassword} setState={setNavPassword} regEx={regEx.password} />
                    <Button customFunction={handleNavLogin} borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' height={true} />
                </div>
            }
        </div>
    )
}

export default Navbar