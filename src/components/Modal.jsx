import React from 'react';
import { BsX } from 'react-icons/bs';

import { Button } from '.';

const Modal = ({ title, text, color, icon, setState }) => {
    return (
        <div className='flex bg-half-transparent w-screen h-screen fixed nav-item top-0 right-0 px-2'>
            <div className=' w-760 flex flex-col justify-between m-auto bg-white rounded-lg'>
                <span style={{ backgroundColor: color }} className='h-2 rounded-t-lg'></span>
                <button type='button' onClick={() => setState(false)} className='w-fit self-end text-xl p-4 hover:bg-light-gray'>
                    <BsX />
                </button>
                <div className='flex p-4 pt-0 gap-2 lg:gap-10 items-center'>
                    <div style={{ color }} className=' text-6xl'>
                        {icon}
                    </div>
                    <div>
                        <p className='pb-3 font-medium text-lg '>{title}</p>
                        <p className='text-base font-extralight'>{text}</p>
                    </div>
                </div>
                <span style={{ borderColor: color }} className='border'></span>
                <div className='flex gap-3 justify-end p-4 rounded-b-lg'>
                    <Button customFunction={() => setState(false)} borderColor='#161616' color='#161616' backgroundColor='transparent' text='Cancelar' />
                    <Button customFunction={() => setState(false)} borderColor={color} color='#FFFFFF' backgroundColor={color} text='Continuar' />
                </div>
            </div>
        </div>
    )
}

export default Modal