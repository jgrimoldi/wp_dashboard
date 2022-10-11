import React, { useEffect, useState } from 'react';
import { BsXCircle, BsTrash } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../../components';
import { productsTypeGrid, regEx } from '../../data/dummy';
import { URL_PRODUCTTYPE } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../../services/GdrService';
import { insertProductType } from '../../services/ProductService';

const ProductType = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [productTypesData, setProductsTypeData] = useState([]);

  const [newProductType, setNewProductType] = useState({ value: '', error: null });
  const [details, setDetails] = useState({ value: '', error: null });
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProductsType = async () => {
      await getDataFrom(URL_PRODUCTTYPE, signal, auth.token)
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
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const addProductType = async () => {
    if (newProductType.error === false && details.error === false) {
      await insertProductType(newProductType.value, details.value, auth.token)
        .then(response => {
          setProductsTypeData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_ALMACEN') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
            return;
          }
          setBanner({ ...banner, valid: false, error: true });
        })
    } else {
      setBanner({ ...banner, valid: false, error: true });
    }
  }

  const confirmDelete = () => {
    const objectsId = productTypesData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_PRODUCTTYPE, openModal.value, auth.token)
      .then(() => {
        setProductsTypeData(current => current.filter(productType => productType.id !== Number(openModal.value)));
        setBanner({ ...banner, deleted: true });
      })
      .catch(() => {
        setBanner({ ...banner, error: true });
      })
      .finally(() => {
        setOpenModal({ ...openModal, value: '', open: false })
      })
  }

  return (
    <>
      <SEO title='Tipo de productos' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo tipo de producto agregado!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Tipo de" title="Productos" />
        <div className='w-full flex flex-wrap justify-evenly gap-5 pb-5'>
          <Input id='type' label='Nuevo tipo de producto' size='small' css='w-full sm:w-2/5' required={true} state={newProductType} setState={setNewProductType} regEx={regEx.notEmpty} />
          <Input id='details' label='Detalles del tipo de producto' size='small' css='w-full sm:w-2/5' required={true} state={details} setState={setDetails} regEx={regEx.notEmpty} />
          <Button customFunction={addProductType} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar tipo de producto' />
        </div>
        <Table header={productsTypeGrid} data={productTypesData} filterTitle='Tipo de Productos' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => setIdSelected('')} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default ProductType