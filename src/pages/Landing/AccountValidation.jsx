import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Form, Button } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const AccountValidation = () => {
    const { setLoginNavbar } = useStateContext();
    const { token } = useParams();

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleValidation = () => { }

    return (
        <div className='w-full flex justify-center items-center mt-80 md:mt-0'>
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