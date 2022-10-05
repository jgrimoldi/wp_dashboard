import React, { useEffect, useState } from 'react';

import { SEO, Banner, Title, Table } from '../../components';
import { categoryGrid } from '../../data/dummy';
import { URL_CATEGORY } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { getDataFrom } from '../../services/GdrService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getCategories = async () => {
      await getDataFrom(URL_CATEGORY, signal, auth.token)
        .then(response => {
          setCategoryData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getCategories();
    return () => { controller.abort(); };
  }, [auth, setAuth, categoryData, setCategoryData])

  return (
    <>
      <SEO title='Categoria de proveedores' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Lista de" title="Insumos" />
        <Table header={categoryGrid} data={categoryData} />
      </div>
    </>
  )
}

export default Products
