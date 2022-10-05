import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table } from '../../components';
import { providersGrid } from '../../data/dummy';
import { URL_SUPPLIER } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { getDataFrom } from '../../services/GdrService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [providersData, setProvidesData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProviders = async () => {
      await getDataFrom(URL_SUPPLIER, signal, auth.token)
        .then(response => {
          setProvidesData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getProviders();
    return () => { controller.abort(); };
  }, [auth, setAuth, providersData, setProvidesData])

  return (
    <>
      <SEO title='Proveedores' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Lista de" title="Proveedores" />
        <Table header={providersGrid} data={providersData} />
      </div>
    </>
  )
}

export default Products
