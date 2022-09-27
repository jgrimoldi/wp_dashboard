import React from 'react'

const Button = ({ borderColor, color, backgroundColor, text, height }) => {

  const small = '39.97px';
  const normal = '55.97px';

  return (
    <button type='button' style={{ borderColor, backgroundColor, color, height: height ? normal : small }} className={`w-48 py-2 border text-base p-3 hover:drop-shadow-xl rounded-md`}>
      {text}
    </button>
  )
}

export default Button