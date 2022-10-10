import React from 'react';

import { SEO, LastLogin, Title, Clock, Calendar, Tiles, LineChart } from '../components';
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>

          <div className='w-full inline-flex flex-wrap gap-2'>
            <Clock />
            <Calendar />
            <Tiles />
            <Tiles />
          </div>

          <div className="border p-2 rounded-lg">
            <div className="mb-2">
              <p className="text-xl font-semibold">Resumen de ventas</p>
            </div>
            <div className="md:w-full overflow-auto">
              <LineChart />
            </div>
          </div>

          <div>

          </div>

        </div>
      </div>
      <LastLogin lastLogin={lastLogin} />
    </>
  )
}

export default Dashboard