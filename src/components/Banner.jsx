import React from 'react';
import { BsX } from 'react-icons/bs';

const Banner = ({ text, backgroundColor, setState }) => {
    return (
        <div style={{ backgroundColor }} className='w-full flex text-white font-bold justify-between px-6 py-4 mt-20 md:mt-3 '>
            {text}
            <button type='button' onClick={setState} className='text-xl'>
                <BsX />
            </button>
        </div>
    )
}

export default Banner