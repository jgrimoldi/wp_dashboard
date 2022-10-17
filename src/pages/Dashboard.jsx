import React, { useEffect, useState } from 'react';

import { SEO, LastLogin, Title, Notifications, Clock, Calendar, Tiles, LineChart, Table } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { usersGrid } from '../data/dummy';
import { URL_AUTH, URL_DASHBOARD, URL_PRODUCT, URL_SUPPLIER } from '../services/Api';
import { getDataFrom } from '../services/GdrService';

const Dashboard = () => {
  const { auth, setAuth } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [stock, setStock] = useState([]);
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
    const getStock = async () => {
      await getDataFrom(URL_DASHBOARD + 'stockValorizado', signal, auth.token)
        .then(response => {
          setStock(response.data[0]['STOCK VALORIZADO']);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getStock();
    getUsers();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  return (
    <>
      <SEO title='Dashboard' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10'>
        <Title category='Hola,' title={fullName} />
        <div className='overflow-hidden relative p-2'>
          <div className='float-left w-full sm:w-2/3 grid grid-cols-1 gap-8 items-center rounded-3xl p-4 '>
            <div className='w-full inline-flex flex-wrap gap-2'>
              <Clock /> <Calendar />
              <div className='min-w-fit w-full sm:w-1/4 flex-auto flex flex-col gap-2 items-center justify-center rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white shadow-xl'>
                <p className='capitalize text-xs'>Stock Valorizado</p>
                <p className='text-5xl font-[monospace] text-center'>{stock}</p>
              </div>
              <Tiles title='Proveedores' text='proveedor' url={URL_SUPPLIER} token={auth.token} to='/proveedores' />
              <Tiles title='Productos' text='producto' url={URL_PRODUCT} token={auth.token} to='/productos' />
            </div>
            <div className='w-full bg-white p-5 rounded-lg shadow-xl'>
              <div className='mb-2'>
                <p className='text-xl font-semibold'>Ingresos/Egresos</p>
              </div>
              <div className='md:w-full overflow-auto'>
                <LineChart />
              </div>
            </div>
            <div className='bg-white p-5 rounded-lg shadow-xl'>
              <Table header={usersGrid} data={users.filter(user => user.id !== auth.user.id && user.fk_perfil !== 3)} filterTitle='Empleados' />
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