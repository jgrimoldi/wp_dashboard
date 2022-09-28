import React from 'react';
import { useParams } from 'react-router-dom';

import { Form, Button } from '../../components';

const AccountValidation = () => {
    const { token } = useParams();
    console.log(token);

    const handleValidation = () => { }

    return (
        <div className='w-full flex justify-center items-center'>
            <Form title='Validar mi correo'>
                <div className='text-left'>
                    Para completar su perfil y comenzar a utilizar AG Stock, tendrá que verificar su dirección de correo electrónico
                </div>
                <Button customFunction={handleValidation} borderColor='blue' color='white' backgroundColor='blue' text='Validar mi cuenta' width='full' height={true} />
            </Form>
        </div>
    )
}

export default AccountValidation