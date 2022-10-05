import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table, Button } from '../../components';
import { productsTypeGrid } from '../../data/dummy';
import { URL_PRODUCTTYPE } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { getDataFrom } from '../../services/GdrService';

const ProductType = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [productTypesData, setProductsTypeData] = useState([]);

  useEffect(() => {
    const getProductsType = async () => {
      await getDataFrom(URL_PRODUCTTYPE, auth.token)
        .then(response => {
          setProductsTypeData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getProductsType();
  }, [auth, setAuth, productTypesData, setProductsTypeData])

  return (
    <>
      <SEO title='Tipo de productos' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Tipo de" title="Productos" />
        <Table header={productsTypeGrid} data={productTypesData} />
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={() => { }} borderColor='blue' color='white' backgroundColor='blue' text='Nuevo backup' />
        </div>
      </div>
    </>
  )
}

export default ProductType