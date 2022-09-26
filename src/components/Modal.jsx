import React from 'react';
import { BsX } from 'react-icons/bs';

import { Button } from '.';

const Modal = ({ color, icon }) => {
    return (
        <div className='flex bg-half-transparent w-screen h-screen fixed nav-item top-0 right-0'>
            <div className=' w-760 flex flex-col justify-between m-auto bg-white rounded-lg'>
                <span style={{ backgroundColor: color }} className='h-2 rounded-t-lg'></span>
                <button type='button' onClick={() => { }} className='w-fit self-end text-xl p-4 hover:bg-light-gray'>
                    <BsX />
                </button>
                <div className='flex p-4 pt-0 gap-10 items-center'>
                    <div style={{ color }} className=' text-6xl'>
                        {icon}
                    </div>
                    <div>
                        <p className='pb-3 font-medium text-lg '>Revisa tu correo</p>
                        <p className='text-base font-extralight'>Se ha enviado un correo electrónico a la dirección de correo electrónico proporcionada. Siga las instrucciones del correo electrónico para restablecer su contraseña.</p>
                    </div>
                </div>
                <span style={{ borderColor: color }} className='border'></span>
                <div className='flex gap-3 justify-end p-4 rounded-b-lg'>
                    <Button borderColor='#161616' color='#161616' backgroundColor='transparent' text='Cancelar' />
                    <Button borderColor={color} color='#FFFFFF' backgroundColor={color} text='Continuar' />
                </div>
            </div>
        </div>
    )
}

export default Modal