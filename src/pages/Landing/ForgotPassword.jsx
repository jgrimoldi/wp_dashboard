import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { BsCheckCircle } from 'react-icons/bs';

import { Form, Input, Button, ErrorLabel, Modal, LoadingSpinner, SEO } from '../../components';
import { regEx } from '../../data/dummy';
import { forgotPassword } from '../../services/AuthService';
import { useStateContext } from '../../contexts/ContextProvider';

const ForgotPassword = () => {
    const { setLoginNavbar, themeColors } = useStateContext();
    const captcha = useRef(null);
    const [email, setEmail] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null })
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleForgot = async () => {
        if (captcha.current.getValue()) {
            if (email.error === false) {
                setLoading(true);
                await forgotPassword(email.value)
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
                setValidForm({ ...validForm, value: 'No es un correo válido. Intenta de nuevo.', error: true });
            }
        } else {
            setValidForm({ ...validForm, value: 'Por favor complete el captcha antes de continuar.', error: true });
        }
    }

    return (
        <>
            <SEO title='¿Olvidaste tu contraseña?' />
            <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
                {loading === true && <LoadingSpinner color={themeColors?.primary} />}
                {modal === true &&
                    <Modal
                        title='Revisa tu correo'
                        text='Se ha enviado un correo electrónico a la dirección de correo electrónico proporcionada. Siga las instrucciones del correo electrónico para restablecer su contraseña.'
                        color={themeColors?.secondary} icon={<BsCheckCircle />}
                        setState={() => setModal(false)}
                        buttonText='Continuar'
                    />
                }
                <Form title='Recupera tu cuenta'>
                    <div className='text-left'>
                        ¡No te preocupes! Suele ocurrir. Por favor ingresa el correo asociado con tu cuenta
                    </div>
                    <Input id='email' type='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' />
                    <ReCAPTCHA ref={captcha} sitekey='6LeBRkQhAAAAAE4WcBWP3GxOTlkTG7Ev5iTbXTOj' className='m-auto' />
                    <div className='flex flex-col gap-2'>
                        {validForm.error === true && <ErrorLabel color={themeColors?.error}>{validForm.value}</ErrorLabel>}
                        <div className='flex gap-1'>
                            <Button customFunction={() => { }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Cancelar' width='full' height={true} />
                            <Button customFunction={handleForgot} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Enviar' width='full' height={true} />
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default ForgotPassword