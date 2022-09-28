import React from 'react';
import { useParams } from 'react-router-dom';

import { Form, Button, Password } from '../../components';

const ResetPassword = () => {
    const { token } = useParams();
    console.log(token);

    const handleReset = () => { }

    return (
        <div className='w-full flex justify-center items-center'>
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