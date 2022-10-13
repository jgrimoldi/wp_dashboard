import React from 'react';
import { BsBell } from 'react-icons/bs';

const NewNotification = ({ backgroundColor }) => {
  return (
    <div className='relative bg-gray-50 rounded-3xl p-5 mt-4 shadow-md'>
      <span style={{ backgroundColor }} className='absolute inline-flex rounded-full h-2.5 w-2.5 -left-1 -top-1'></span>
      <p className='text-lg text-gray-500 tracking-tight'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  )
}

const Notifications = () => {
  return (
    <div className='sm:absolute right-0 top-0 w-full h-full sm:w-1/3 bg-white rounded-3xl p-4 sm:overflow-hidden overflow-auto sm:hover:overflow-auto shadow-xl'>
      <div className='flex justify-between items-center p-2 pb-3 mb-2 border-b-1'>
        <p className='text-xl font-semibold'>Notificaciones</p><span className='text-2xl'><BsBell /></span>
      </div>
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
      <NewNotification backgroundColor='red' />
    </div>
  )
}

export default Notifications