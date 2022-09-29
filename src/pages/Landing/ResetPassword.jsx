import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { Form, Button, Password, ErrorLabel, Modal, LoadingSpinner } from '../../components';
import { regEx } from '../../data/dummy';
import { resetPassword, updatePasswordByEmail } from '../../services/AuthService';
import { useStateContext } from '../../contexts/ContextProvider';

const ResetPassword = () => {
    const { setLoginNavbar } = useStateContext();
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
                .then(response => {
                    setValidForm({ ...validForm, error: false });
                    setModal({ ...modal, success: true });
                })
                .catch(error => {
                    console.log(error);
                    setValidForm({ ...validForm, value: 'Ocurrió un error al intentar cambiar la clave. Intenta de nuevo', error: true });
                })
        } else {
            setValidForm({ ...validForm, value: 'Ocurrió un error al intentar cambiar la clave. Intenta de nuevo.', error: true });
        }
    }

    return (
        <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
            {loading && <LoadingSpinner color='blue' />}
            {modal.success === true &&
                <Modal
                    title='Contraseña actualizada'
                    text='Has actualizado correctamente tu contraseña.'
                    color='purple' icon={<BsCheckCircle />}
                    setFunction={() => setModal(false)}
                    buttonText='Continuar'
                />
            }
            {modal.error === true &&
                <Modal
                    title='Oops! Ocurrio un error'
                    text='El siguiente enlace ha caducado o no es correcto. Por favor vuelva a intentar o comuniquese con el soporte.'
                    color='red' icon={<BsXCircle />}
                    setFunction={() => { }}
                    buttonText='Volver al inicio'
                />
            }
            <Form title='Restablece tu contraseña'>
                <div className='text-left'>
                    Tu correo: {email}
                </div>
                <Password id='password' label='Contraseña' color='purple' state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' />
                <Password id='passwordVerify' label='Confirmar contraseña' color='purple' state={passwordVerify} setState={setPasswordVerify} customFunction={handleValidatePassword} helperText='Las contraseñas no coinciden' />
                <div className='flex flex-col gap-2'>
                    {validForm.error === true && <ErrorLabel color='red'>{validForm.value}</ErrorLabel>}
                    <div className='flex gap-1'>
                        <Button customFunction={() => { }} borderColor='black' color='black' backgroundColor='transparent' text='Cancelar' width='full' height={true} />
                        <Button customFunction={handleReset} borderColor='blue' color='white' backgroundColor='blue' text='Confirmar' width='full' height={true} />
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default ResetPassword