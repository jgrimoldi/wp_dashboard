import React from 'react';
import { BsX, BsCheck } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';

import { regEx } from '../data/dummy';

const GroupValidator = ({ password }) => {
    const { themeColors } = useStateContext();
    const uppercasePassword = regEx.uppercaseRegExp.test(password);
    const lowercasePassword = regEx.lowercaseRegExp.test(password);
    const digitsPassword = regEx.digitsRegExp.test(password);
    const specialCharPassword = regEx.specialCharRegExp.test(password);
    const minLengthPassword = regEx.minLengthRegExp.test(password);

    return (
        <div className='flex flex-wrap gap-2'>
            <p className='text-lg text-gray-500 dark:text-gray-100'>Al menos:</p>
            <div className='flex flex-wrap gap-5 sm:px-1'>
                <div className='flex flex-col gap-1'>
                    <span style={{ color: uppercasePassword ? themeColors.confirm : themeColors.error }} className='flex gap-2 items-center text-md whitespace-nowrap'>
                        {uppercasePassword ? <BsCheck /> : <BsX />}1 Mayúscula
                    </span>
                    <span style={{ color: lowercasePassword ? themeColors.confirm : themeColors.error }} className='flex gap-2 items-center text-md whitespace-nowrap'>
                        {lowercasePassword ? <BsCheck /> : <BsX />}1 Minúscula
                    </span>
                    <span style={{ color: digitsPassword ? themeColors.confirm : themeColors.error }} className='flex gap-2 items-center text-md whitespace-nowrap'>
                        {digitsPassword ? <BsCheck /> : <BsX />}1 Número
                    </span>
                </div>
                <div className='flex flex-col gap-1'>
                    <span style={{ color: specialCharPassword ? themeColors.confirm : themeColors.error }} className='flex gap-2 items-center text-md whitespace-nowrap'>
                        {specialCharPassword ? <BsCheck /> : <BsX />}1 Símbolo (#?!@$%^&*+.-)
                    </span>
                    <span style={{ color: minLengthPassword ? themeColors.confirm : themeColors.confirm }} className='flex gap-2 items-center text-md whitespace-nowrap'>
                        {minLengthPassword ? <BsCheck /> : <BsX />}8 Caracteres
                    </span>
                </div>
            </div>
        </div>
    )
}

export default GroupValidator