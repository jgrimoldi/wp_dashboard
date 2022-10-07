import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table } from '../components';
import { warehousesGrid } from '../data/dummy';
import { URL_STORAGE } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const Storage = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [warehousesData, setWarehousesData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getWarehouses = async () => {
      await getDataFrom(URL_STORAGE, signal, auth.token)
        .then(response => {
          setWarehousesData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getWarehouses();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  return (
    <>
      <SEO title='Almacén' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Almacenes" />
        <Table header={warehousesGrid} data={warehousesData} filterTitle='Mis Almacenes' />
      </div>
    </>
  )
}

export default Storage