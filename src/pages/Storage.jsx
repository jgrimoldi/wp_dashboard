import React, { useState, useRef } from 'react';

import { Crud, SEO } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { warehousesGrid } from '../data/dummy';
import { URL_STORAGE } from '../services/Api';
import { insertWarehouses, updateWarehousesById } from '../services/StorageService';

const Storage = () => {
  const { auth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newWarehouse, setNewWarehouse] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const inputConfig = [
    { field: 'nombre', id: 'warehouses', useRef: refFocus, label: 'Nuevo almacén', size: 'small', state: newWarehouse, setState: setNewWarehouse, expression: 'notEmpty', css: 'w-full sm:w-[30%] md:w-1/4' },
    { field: 'detalle', id: 'details', label: 'Detalles del almacén', size: 'small', state: details, setState: setDetails, expression: 'notEmpty', css: 'w-full sm:w-[30%] md:w-1/4' }
  ];

  const addStorage = async () => {
    const response = await insertWarehouses(newWarehouse.value, details.value, auth.token);
    return await response;
  }

  const updateStorage = async (id) => {
    const response = await updateWarehousesById(id, newWarehouse.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Almacén' />
      <Crud title='Almacenes' config={inputConfig} URL={URL_STORAGE} grid={warehousesGrid} add={addStorage} update={updateStorage} />
    </>
  )
}

export default Storage