import React from 'react';

import agSistemas from '../data/agSistemas.png';

const Footer = () => {
  return (
    <>
      <div className='flex justify-center mt-10'>
        <img src={agSistemas} alt='Logo de AGSistemas' />
      </div>
      <div className='mt-8 lg:mt-3'>
        <p className='text-base text-center lg:text-left mx-5 mb-3'>
          AGSistemas © 2022
        </p>
      </div>
    </>
  )
}

export default Footer