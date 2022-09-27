import React from 'react';
import zenet from '../data/zenet.jpg';

const NavbarMobile = () => {
    return (
        <div className='flex justify-center py-10 relative'>
            <div className='flex flex-col gap-5 items-center'>
                <img className='rounded-full w-28 h-28 md:w-32 md:h-32' src={zenet} alt='Logo de Zenet' />
                <h1 className=' text-4xl md:text-5xl uppercase'>Ag Stock</h1>
            </div>
        </div>
    )
}

export default NavbarMobile