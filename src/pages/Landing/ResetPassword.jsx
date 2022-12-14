import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { Form, Button, Password, ErrorLabel, Modal, LoadingSpinner, SEO, GroupValidator } from '../../components';
import { regEx } from '../../data/dummy';
import { resetPassword, updatePasswordByEmail } from '../../services/AuthService';
import { useStateContext } from '../../contexts/ContextProvider';

const ResetPassword = () => {
    const { setLoginNavbar, themeColors } = useStateContext();
    const { token } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState({ value: '', error: null });
    const [passwordVerify, setPasswordVerify] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null })
    const [modal, setModal] = useState({ success: null, error: null });
    const [loading, setLoading] = useState(null);
    const [isMounted, setIsMounted] = useState(null);


    useEffect(() => {
        setLoginNavbar(true);

        const getToken = async () => {
            setLoading(true);
            await resetPassword(token)
                .then(response => {
                    setEmail(response.data.email);
                    setModal({ ...modal, error: false });
                })
                .catch(() => {
                    setModal({ ...modal, error: true });
                })
                .finally(() => {
                    setIsMounted(true);
                    setLoading(false);
                })
        }

        if (isMounted === null) {
            getToken();
        }

    }, [setLoginNavbar, modal, token, isMounted]);

    const handleValidatePassword = () => {
        if (password.value.length > 0) {
            if (password.value !== passwordVerify.value) {
                setPasswordVerify((prevState) => { return { ...prevState, error: true } })
            } else {
                setPasswordVerify((prevState) => { return { ...prevState, error: false } })
            }
        }
    }

    const handleReset = async () => {
        if (password.error === false && passwordVerify.error === false && modal.error === false) {
            await updatePasswordByEmail(email, password.value, token)
                .then(() => {
                    setValidForm({ ...validForm, error: false });
                    setModal({ ...modal, success: true });
                })
                .catch(() => {
                    setValidForm({ ...validForm, value: 'Ocurri?? un error al intentar cambiar la clave. Intenta de nuevo', error: true });
                })
        } else {
            setValidForm({ ...validForm, value: 'Ocurri?? un error al intentar cambiar la clave. Intenta de nuevo.', error: true });
        }
    }

    return (
        <>
            <SEO title='Restablece tu contrase??a' />
            <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
                {loading === true && <LoadingSpinner color={themeColors?.primary} />}
                {modal.success === true &&
                    <Modal
                        title='Contrase??a actualizada'
                        text='Has actualizado correctamente tu contrase??a.'
                        color={themeColors?.secondary} icon={<BsCheckCircle />}
                        setFunction={() => setModal({ ...modal, success: false })}
                        buttonText='Continuar'
                    />
                }
                {modal.error === true &&
                    <Modal
                        title='Oops! Ocurrio un error'
                        text='El siguiente enlace ha caducado o no es correcto. Por favor vuelva a intentar o comuniquese con el soporte.'
                        color={themeColors?.error} icon={<BsXCircle />}
                        setFunction={() => { }}
                        buttonText='Volver al inicio'
                    />
                }
                <Form title='Restablece tu contrase??a'>
                    <div className='text-left'>
                        Tu correo: {email}
                    </div>
                    <Password id='password' label='Contrase??a' color={themeColors?.secondary} state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contrase??a v??lida' />
                    <Password id='passwordVerify' label='Confirmar contrase??a' color={themeColors?.secondary} state={passwordVerify} setState={setPasswordVerify} customFunction={handleValidatePassword} helperText='Las contrase??as no coinciden' />
                    {!!password.value && <GroupValidator password={password.value} />}
                    <div className='flex flex-col gap-2'>
                        {validForm.error === true && <ErrorLabel color={themeColors?.error}>{validForm.value}</ErrorLabel>}
                        <div className='flex gap-1'>
                            <Button customFunction={() => { }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Cancelar' width='full' height={true} />
                            <Button customFunction={handleReset} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Confirmar' width='full' height={true} />
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default ResetPassword