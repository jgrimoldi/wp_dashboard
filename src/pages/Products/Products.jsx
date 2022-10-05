import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table, Button } from '../../components';
import { productsGrid } from '../../data/dummy';
import { URL_PRODUCT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { getDataFrom } from '../../services/GdrService';


const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      await getDataFrom(URL_PRODUCT, auth.token)
        .then(response => {
          setProductsData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getProducts();
  }, [auth, setAuth, productsData, setProductsData])

  return (
    <>
      <SEO title='Productos' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Productos" />
        <Table header={productsGrid} data={productsData} />
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={() => { }} borderColor='blue' color='white' backgroundColor='blue' text='Nuevo backup' />
        </div>
      </div>
    </>
  )
}

export default Products