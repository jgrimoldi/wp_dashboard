import React, { useEffect } from 'react';

import { Form, Input, Button } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const ForgotPassword = () => {
    const { setLoginNavbar } = useStateContext();

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleForgot = () => { }

    return (
        <div className='w-full flex justify-center items-center'>
            <Form title='Recupera tu cuenta'>
                <div className='text-left'>
                    ¡NO TE PREOCUPES! SUELE OCURRIR. POR FAVOR INGRESA EL CORREO ASOCIADO CON TU CUENTA
                </div>
                <Input id='email' type='email' label='Correo electrónico' />
                TODO: Agregar reCaptcha
                <div className='flex gap-1'>
                    <Button customFunction={() => { }} borderColor='black' color='black' backgroundColor='transparent' text='Cancelar' width='full' height={true} />
                    <Button customFunction={handleForgot} borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' width='full' height={true} />
                </div>
            </Form>
        </div>
    )
}

export default ForgotPassword