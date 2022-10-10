import React, { useEffect, useState } from 'react';

import { SEO, LastLogin, Title, Clock, Calendar, Tiles, LineChart, Table } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { usersGrid } from '../data/dummy';
import { URL_AUTH } from '../services/Api';
import { getDataFrom } from '../services/GdrService';

const Dashboard = () => {
  const { auth, setAuth } = useAuthContext();
  const [users, setUsers] = useState([]);
  const fullName = !!auth.user ? auth.user.nombre + ' ' + auth.user.apellido : ''
  const lastLogin = !!auth.user ? auth.user.lastlogin : '';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getUsers = async () => {
      await getDataFrom(URL_AUTH, signal, auth.token)
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getUsers();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  return (
    <>
      <SEO title='Dashboard' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category='Hola,' title={fullName} />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>

          <div className='w-full inline-flex flex-wrap gap-2'>
            <Clock />
            <Calendar />
            <Tiles />
            <Tiles />
          </div>

          <div>
            <Table header={usersGrid} data={users.filter(user => user.id !== auth.user.id)} filterTitle='Empleados' />
          </div>

          <div className="border p-2 rounded-lg">
            <div className="mb-2">
              <p className="text-xl font-semibold">Resumen de ventas</p>
            </div>
            <div className="md:w-full overflow-auto">
              <LineChart />
            </div>
          </div>

        </div>
      </div>
      <LastLogin lastLogin={lastLogin} />
    </>
  )
}

export default Dashboard