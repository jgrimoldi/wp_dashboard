import React, { useEffect, useState, useRef } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../../components';
import { productsTypeGrid, regEx } from '../../data/dummy';
import { URL_PRODUCTTYPE } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../../services/GdrService';
import { insertProductType, updateProductTypeById } from '../../services/ProductService';

const ProductType = () => {
  const { auth, setAuth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null, edit: null });
  const [productTypesData, setProductsTypeData] = useState([]);
  const [newProductType, setNewProductType] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

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

  const clearInputs = () => {
    setNewProductType(initialState);
    setDetails(initialState);
  }

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
        .finally(() => {
          clearInputs();
          refFocus.current.focus();
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

  const editInputs = async () => {
    await getDataByIdFrom(URL_PRODUCTTYPE, idSelected, auth.token)
      .then(response => {
        setNewProductType({ ...newProductType, value: response.data.nombre });
        setDetails({ ...details, value: response.data.descripcion });
      })
      .catch(() => {
        setNewProductType({ ...newProductType, value: '' });
        setDetails({ ...details, value: '' });
      })
      .finally(() => {
        setEdit(true);
        refFocus.current.focus();
      })
  }

  const editProductType = async () => {
    await updateProductTypeById(idSelected, newProductType.value, details.value, auth.token)
      .then(() => {
        const selected = productTypesData.find(productType => productType.id === Number(idSelected));
        selected.nombre = newProductType.value;
        selected.descripcion = details.value;
        setBanner({ ...banner, edit: true });
      })
      .catch(() => {
        setBanner({ ...banner, error: true });
      })
      .finally(() => {
        clearInputs();
        setIdSelected('');
        setEdit(false);
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
      {banner.edit === true && <Banner text='¡Registro editado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, edit: false })} />}
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo tipo de producto agregado!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Tipo de" title="Productos" />
        <div className='w-full flex flex-wrap justify-evenly gap-5 pb-5'>
          <Input id='type' useRef={refFocus} label='Nuevo tipo de producto' size='small' css='w-full sm:w-2/5' required={true} state={newProductType} setState={setNewProductType} regEx={regEx.notEmpty} />
          <Input id='details' label='Detalles del tipo de producto' size='small' css='w-full sm:w-2/5' required={true} state={details} setState={setDetails} regEx={regEx.notEmpty} />
          {edit === true ? <Button customFunction={editProductType} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar tipo de producto' />
            : <Button customFunction={addProductType} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar tipo de producto' />}
        </div>
        <Table header={productsTypeGrid} data={productTypesData} filterTitle='Tipo de Productos' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => { setIdSelected(''); clearInputs() }} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={editInputs} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Editar registro' icon={<BsPencil />} />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default ProductType