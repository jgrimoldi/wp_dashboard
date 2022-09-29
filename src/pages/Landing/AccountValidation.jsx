import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { Form, Button, Modal } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const AccountValidation = () => {
    const { setLoginNavbar } = useStateContext();
    const { token } = useParams();
    const [validForm, setValidForm] = useState({ value: '', error: null })
    const [modal, setModal] = useState(null);

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleValidation = () => { }

    return (
        <div className='w-full flex justify-center items-center mt-80 md:mt-0'>
            {modal === null &&
                <Modal
                    title='Cuenta activada'
                    text='Gracias, su correo electrónico ha sido verificado. Su cuenta está ahora activa. Utilice el siguiente enlace para acceder a su cuenta.'
                    color='purple' icon={<BsCheckCircle />}
                    setState={setModal}
                />
            }
            {modal === true &&
                <Modal
                    title='Oops! Ocurrio un error'
                    text='El siguiente enlace ha caducado o no es correcto. Por favor vuelva a intentar o comuniquese con el soporte.'
                    color='red' icon={<BsXCircle />}
                    setState={setModal}
                />
            }
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