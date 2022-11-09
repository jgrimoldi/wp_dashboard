import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { Form, Button, Modal, LoadingSpinner, SEO } from '../../components';
import { validateAccount } from '../../services/AuthService';
import { useStateContext } from '../../contexts/ContextProvider';

const AccountValidation = () => {
    const { setLoginNavbar, themeColors } = useStateContext();
    const { token } = useParams();
    const [modal, setModal] = useState({ success: null, error: null });
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleValidation = async () => {
        setLoading(true);
        await validateAccount(token)
            .then(() => {
                setModal({ ...modal, success: true });
            })
            .catch(() => {
                setModal({ ...modal, error: true });
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <SEO title='Valida tu cuenta' />
            <div className='w-full flex justify-center items-center mt-80 md:mt-0'>
                {loading === true && <LoadingSpinner color={themeColors?.primary} />}
                {modal.success === true &&
                    <Modal
                        title='Cuenta activada'
                        text='Gracias, su correo electrónico ha sido verificado. Su cuenta está ahora activa. Utilice el siguiente enlace para acceder a su cuenta.'
                        color={themeColors?.secondary} icon={<BsCheckCircle />}
                        setState={() => setModal({ ...modal, success: false })}
                        buttonText='Continuar'
                    />
                }
                {modal.error === true &&
                    <Modal
                        title='Oops! Ocurrio un error'
                        text='El siguiente enlace ha caducado o no es correcto. Por favor vuelva a intentar o comuniquese con el soporte.'
                        color={themeColors?.error} icon={<BsXCircle />}
                        setState={() => { }}
                        buttonText='Volver al inicio'
                    />
                }
                <Form title='Validar mi correo'>
                    <div className='text-left'>
                        Para completar su perfil y comenzar a utilizar AG Stock, tendrá que verificar su dirección de correo electrónico
                    </div>
                    <Button customFunction={handleValidation} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Validar mi cuenta' width='full' height={true} />
                </Form>
            </div>
        </>
    )
}

export default AccountValidation