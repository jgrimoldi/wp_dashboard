import React, { useEffect, useState } from 'react';
import { BsXCircle, BsTrash } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../components';
import { warehousesGrid, regEx } from '../data/dummy';
import { URL_STORAGE } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../services/GdrService';
import { insertWarehouses } from '../services/StorageService';

const Storage = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null });
  const [warehousesData, setWarehousesData] = useState([]);
  
  const [newWarehouse, setNewWarehouse] = useState({ value: '', error: null });
  const [details, setDetails] = useState({ value: '', error: null });
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });

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

  const addWarehouse = async () => {
    if (newWarehouse.error === false && details.error === false) {
      await insertWarehouses(newWarehouse.value, details.value, auth.token)
        .then(response => {
          setWarehousesData(prevState => [...prevState, response.data]);
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
    const objectsId = warehousesData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_STORAGE, openModal.value, auth.token)
      .then(() => {
        setWarehousesData(current => current.filter(warehouse => warehouse.id !== Number(openModal.value)));
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
      <SEO title='Almacén' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo almacén agregado!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Almacenes" />
        <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
          <Input id='warehouses' label='Nuevo almacén' size='small' css='w-2/5' required={true} state={newWarehouse} setState={setNewWarehouse} regEx={regEx.notEmpty} />
          <Input id='details' label='Detalles del almacén' size='small' css='w-2/5' required={true} state={details} setState={setDetails} regEx={regEx.notEmpty} />
          <Button customFunction={addWarehouse} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar almacén' />
        </div>
        <Table header={warehousesGrid} data={warehousesData} filterTitle='Mis Almacenes' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => setIdSelected('')} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default Storage