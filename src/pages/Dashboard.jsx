import React, { useEffect, useState } from 'react';

import { SEO, LastLogin, Title, Notifications, Clock, Calendar, Tiles, LineChart, Table } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { usersGrid } from '../data/dummy';
import { URL_AUTH, URL_PRODUCT, URL_SUPPLIER } from '../services/Api';
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

  const sortByLastLogin = (data, anotherData) => new Date(anotherData.lastlogin) < new Date(data.lastlogin) ? -1 : 1

  return (
    <>
      <SEO title='Dashboard' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 '>
        <Title category='Hola,' title={fullName} />
        <div className='overflow-hidden relative p-2'>
          <div className='float-left w-full sm:w-2/3 grid grid-cols-1 gap-8 items-center rounded-3xl p-4 '>
            <div className='w-full inline-flex flex-wrap gap-2'>
              <Clock /> <Calendar />
              <Tiles title='Proveedores' text='proveedor' url={URL_SUPPLIER} token={auth.token} to='/proveedores' />
              <Tiles title='Productos' text='producto' url={URL_PRODUCT} token={auth.token} to='/productos' />
            </div>
            <LineChart />
            <div className='bg-white dark:bg-secondary-dark-bg p-5 rounded-lg shadow-xl'>
              <Table header={usersGrid} data={users.filter(user => user.id !== auth.user.id && user.fk_perfil !== 3)} filterTitle='Empleados' sortFunction={sortByLastLogin} />
            </div>
          </div>
          <Notifications />
        </div>
        <LastLogin lastLogin={lastLogin} />
      </div>
    </>
  )
}

export default Dashboard