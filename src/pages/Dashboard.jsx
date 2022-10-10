import React from 'react';

import { SEO, LastLogin, Title, Clock, Calendar, Tiles } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';

const Dashboard = () => {
  const { auth } = useAuthContext();
  const fullName = !!auth.user ? auth.user.nombre + ' ' + auth.user.apellido : ''
  const lastLogin = !!auth.user ? auth.user.lastlogin : '';

  return (
    <>
      <SEO title='Dashboard' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category='Hola,' title={fullName} />
        <div className='w-full flex flex-wrap justify-center gap-5'>
          <Clock />
          <Calendar />
          <Tiles />
        </div>
        <div className='w-full flex flex-wrap'>
          <div className='w-2/4'>
            <p></p>
          </div>
          <div className='w-2/4'>
            <p></p>
          </div>
        </div>
      </div>
      <LastLogin lastLogin={lastLogin} />
    </>
  )
}

export default Dashboard