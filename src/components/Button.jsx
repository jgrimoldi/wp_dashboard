import React from 'react'

const Button = ({ customFunction, borderColor, color, backgroundColor, text, width = '48', height }) => {

  const small = '39.97px';
  const normal = '55.97px';

  return (
    <button type='button' onClick={customFunction} style={{ borderColor, backgroundColor, color, height: height ? normal : small }} className={`w-${width} py-2 border text-base p-3 hover:drop-shadow-xl rounded-md`}>
      {text}
    </button>
  )
}

export default Button