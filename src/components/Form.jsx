import React from 'react'

const Form = ({ title, children }) => {
    return (
        <div className='w-400 flex flex-col text-center '>
            <h2 className='text-xl'>{title}</h2>
            <div className='flex flex-col gap-7 p-4 bg-white rounded-lg shadow-xl'>
                {children}
            </div>
        </div>
    )
}

export default Form