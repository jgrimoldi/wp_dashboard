import React from 'react'

const Button = ({ color, backgroundColor, text }) => {
  return (
    <button type='button' style={{ borderColor: color, backgroundColor: backgroundColor, color: color }} className='border text-md p-3 hover:drop-shadow-xl rounded-md'>
      {text}
    </button>
  )
}

export default Button