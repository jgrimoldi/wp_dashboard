import React from 'react';

import unauthorized from '../data/unauthorized.svg';
import { SEO } from '../components';

const Unauthorized = () => {
  return (
    <>
      <SEO title='Ups!' />
      <div className='relative flex-col m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <div className='absolute text-center z-50'>
          <span className='uppercase text-xl font-bold -pb-20 text-slate-900 dark:text-slate-100'>Error</span>
          <h1 className='text-[200px] font-[monospace] font-bold leading-none -mt-8 text-slate-900 dark:text-slate-100'>401</h1>
          <span className='z-40 text-slate-900 dark:text-slate-100'>No cuentas con los permisos necesarios.</span>
        </div>
        <div className='block w-3/4 m-auto top-0 bottom-0 z-0'>
          <img className='w-full m-auto' src={unauthorized} alt='No tienes permisos' />
        </div>
      </div>
    </>
  )
}

export default Unauthorized