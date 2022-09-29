import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { Form, Button, Password, ErrorLabel, Modal } from '../../components';
import { regEx } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

const ResetPassword = () => {
    const { setLoginNavbar } = useStateContext();
    const { token } = useParams();
    const [password, setPassword] = useState({ value: '', error: null });
    const [passwordVerify, setPasswordVerify] = useState({ value: '', error: null });
    const [validForm, setValidForm] = useState({ value: '', error: null })
    const [modal, setModal] = useState(null);

    useEffect(() => {
        setLoginNavbar(true);
    }, [setLoginNavbar]);

    const handleValidatePassword = () => {
        if (password.value.length > 0) {
            if (password.value !== passwordVerify.value) {
                setPasswordVerify((prevState) => { return { ...prevState, error: true } })
            } else {
                setPasswordVerify((prevState) => { return { ...prevState, error: false } })
            }
        }
    }

    const handleReset = () => {
        if (password.error === false && passwordVerify.error === false) {
            setValidForm({ ...validForm, error: false });
        } else {
            setValidForm({ ...validForm, value: 'Contraseña incorrecta. Intenta de nuevo.', error: true });
        }
    }

    return (
        <div className='w-full flex justify-center items-center mt-60 md:mt-0'>
            {modal === null &&
                <Modal
                    title='Contraseña actualizada'
                    text='Has actualizado correctamente tu contraseña.'
                    color='purple' icon={<BsCheckCircle />}
                    setState={setModal}
                />
            }
            {modal === null &&
                <Modal
                    title='Oops! Ocurrio un error'
                    text='El siguiente enlace ha caducado o no es correcto. Por favor vuelva a intentar o comuniquese con el soporte.'
                    color='red' icon={<BsXCircle />}
                    setState={setModal}
                />
            }
            <Form title='Restablece tu contraseña'>
                <div className='text-left'>
                    Tu correo: johndoe@example.com
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