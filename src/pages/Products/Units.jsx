import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table, Button } from '../../components';
import { unitsGrid } from '../../data/dummy';
import { URL_UNIT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { getDataFrom } from '../../services/GdrService';

const Units = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const getUnits = async () => {
      await getDataFrom(URL_UNIT, auth.token)
        .then(response => {
          setUnits(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getUnits();
  }, [auth, setAuth, units, setUnits])

  return (
    <>
      <SEO title='Unidades de medida' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Unidades de" title="Medida" />
        <Table header={unitsGrid} data={units} />
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={() => { }} borderColor='blue' color='white' backgroundColor='blue' text='Nuevo backup' />
        </div>
      </div>
    </>
  )
}

export default Units