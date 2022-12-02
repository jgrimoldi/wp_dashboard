import React from 'react';
import { BsX } from 'react-icons/bs';

import { useStateContext } from '../contexts/ContextProvider';

const Banner = ({ text, backgroundColor, setState }) => {
    const { activeMenu } = useStateContext();

    return (
        <div style={{ backgroundColor }} className={`fixed ${activeMenu ? 'w-[calc(100%_-_18rem)]' : 'w-full'}  flex text-white font-bold justify-between px-6 py-4 -mt-16`}>
            {text}
            <button type='button' onClick={setState} className='text-xl'>
                <BsX />
            </button>
        </div>
    )
}

export default Banner