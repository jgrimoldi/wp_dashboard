import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';

import { SEO, LoadingSpinner, Modal, Form, Input, ErrorLabel, Button } from '../../components';
import { regEx } from '../../data/dummy';
import { useAuthContext } from '../../contexts/ContextAuth'
import { useStateContext } from '../../contexts/ContextProvider';
import { reSendValidation } from '../../services/AuthService';

const NotValid = () => {
    const { themeColors } = useStateContext();
    const { auth } = useAuthContext();
    const [email, setEmail] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null })
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleValidation = async () => {
        if (email.error === false) {
            if (email.value === auth.notValid.user.email) {
                setLoading(true);
                await reSendValidation(email.value, auth.notValid.token)
                    .then(() => {
                        setValidForm({ ...validForm, error: false });
                        setModal(true);
                    })
                    .catch(() => {
                        setValidForm({ ...validForm, value: 'Correo incorrecto. Intenta de nuevo.', error: true });
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            } else {
                setValidForm({ ...validForm, value: 'El correo no coincide con el de ingreso', error: true });
            }
        } else {
            setValidForm({ ...validForm, value: 'No es un correo válido. Intenta de nuevo.', error: true });
        }
    }

    return (
        <>
            <SEO title='Necesitas validar tu cuenta' />
            <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
                {loading === true && <LoadingSpinner color={themeColors?.primary} />}
                {modal === true &&
                    <Modal
                        title='Revisa tu correo'
                        text='Se ha enviado un correo electrónico a la dirección de correo electrónico proporcionada. Siga las instrucciones del correo electrónico para validar su cuenta.'
                        color={themeColors?.secondary} icon={<BsCheckCircle />}
                        setState={() => setModal(false)}
                        buttonText='Continuar'
                    />
                }
                <Form title='Reenviar validación'>
                    <div className='text-left'>
                        ¡No estas validado! Su cuenta aún no ha sido validada. Para validar su cuenta, confirme su correo, haga clic en el botón de reenvío de correo electrónico que aparece a continuación y siga las instrucciones.
                    </div>
                    <Input id='email' type='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' />
                    <div className='flex flex-col gap-2'>
                        {validForm.error === true && <ErrorLabel color={themeColors?.error}>{validForm.value}</ErrorLabel>}
                        <div className='flex gap-1'>
                            <Button customFunction={handleValidation} borderColor={themeColors?.primary} color='white' backgroundColor={themeColors?.primary} text='Reenvío de correo electrónico' width='full' height={true} />
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default NotValid