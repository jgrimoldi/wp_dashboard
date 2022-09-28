import React from 'react';

import zenet from '../data/zenet.jpg';
import { Input, Password, Button } from '.';

import { useStateContext } from '../contexts/ContextProvider';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const { loginNavbar } = useStateContext();

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
                    <Input id='navEmail' type='email' label='Correo electrónico' css='w-60' />
                    <Password id='navPassword' label='Contraseña' color='purple' css='w-60' />
                    <Button borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' height={true} />
                </div>
            }
        </div>
    )
}

export default Navbar