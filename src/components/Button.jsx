import React from 'react'

const Button = ({ type = 'button', customFunction, borderColor, color, backgroundColor, text, width = '48', height, icon, tabindex }) => {

  const small = '39.97px';
  const normal = '55.97px';

  return (
    <button tabIndex={tabindex} type={type} onClick={customFunction} style={{ borderColor, backgroundColor, color, height: height ? normal : small }} className={`w-${width} flex justify-center items-center gap-2 py-2 border text-base p-3 hover:drop-shadow-xl rounded-md`}>
      {text} {icon && <span className='text-xl'>{icon}</span>}
    </button>
  )
}

export default Button