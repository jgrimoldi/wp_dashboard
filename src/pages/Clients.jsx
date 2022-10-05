import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table } from '../components';
import { clientsGrid } from '../data/dummy';
import { URL_CLIENT } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const Clients = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getClientes = async () => {
      await getDataFrom(URL_CLIENT, signal, auth.token)
        .then(response => {
          setClientsData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getClientes();
    return () => { controller.abort(); };
  }, [auth, setAuth, clientsData, setClientsData])

  return (
    <>
      <SEO title='Clientes' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Clientes" />
        <Table header={clientsGrid} data={clientsData} />
      </div>
    </>
  )
}

export default Clients