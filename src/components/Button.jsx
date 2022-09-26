import React from 'react'

const Button = ({ borderColor, color, backgroundColor, text }) => {
  return (
    <button type='button' style={{ borderColor, backgroundColor, color }} className='w-48 py-2 border text-base p-3 hover:drop-shadow-xl rounded-md'>
      {text}
    </button>
  )
}

export default Button