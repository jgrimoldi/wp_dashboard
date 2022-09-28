import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Form, Button, Password } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const ResetPassword = () => {
    const { setLoginNavbar } = useStateContext();
    const { token } = useParams();

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleReset = () => { }

    return (
        <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
            <Form title='Restablece tu contraseña'>
                <div className='text-left'>
                    Tu correo: johndoe@example.com
                </div>
                <Password id='email' label='Contraseña' color='purple' />
                <Password id='emailVerify' label='Confirmar contraseña' color='purple' />
                <div className='flex gap-1'>
                    <Button customFunction={() => { }} borderColor='black' color='black' backgroundColor='transparent' text='Cancelar' width='full' height={true} />
                    <Button customFunction={handleReset} borderColor='blue' color='white' backgroundColor='blue' text='Iniciar sesión' width='full' height={true} />
                </div>
            </Form>
        </div>
    )
}

export default ResetPassword