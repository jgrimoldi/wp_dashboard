import React from 'react';
import { BsX } from 'react-icons/bs';

const Banner = ({ text }) => {
    return (
        <div className='w-full flex bg-green-100 text-green-500 font-bold justify-between px-6 py-4 mt-20 md:mt-3 '>
            {text}
            <button type='button' onClick={() => { }} className='text-xl'>
                <BsX />
            </button>
        </div>
    )
}

export default Banner