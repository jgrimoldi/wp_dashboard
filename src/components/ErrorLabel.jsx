import React from 'react'

const ErrorLabel = ({ color, children }) => {
    return (
        <span style={{ color }} className='md:text-14 text-xs' role='alert'>
            {children}
        </span>
    )
}

export default ErrorLabel