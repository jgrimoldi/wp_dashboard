import React, { useState, useRef } from 'react';

import { Crud, SEO } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { productsTypeGrid } from '../../data/dummy';
import { URL_PRODUCTTYPE } from '../../services/Api';
import { insertProductType, updateProductTypeById } from '../../services/ProductService';

const ProductType = () => {
  const { auth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newProductType, setNewProductType] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const inputConfig = [
    { field: 'nombre', id: 'productType', useRef: refFocus, label: 'Nuevo tipo de producto', state: newProductType, setState: setNewProductType, expression: 'notEmpty', css: '' },
    { field: 'descripcion', id: 'details', label: 'Detalles del tipo de producto', state: details, setState: setDetails, expression: 'notEmpty', css: '' },
  ];

  const addProductType = async () => {
    const response = await insertProductType(newProductType.value, details.value, auth.token);
    return await response;
  }

  const updateProductType = async (id) => {
    const response = await updateProductTypeById(id, newProductType.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Tipo de productos' />
      <Crud sufix='Tipo de' title='Productos' config={inputConfig} URL={URL_PRODUCTTYPE} grid={productsTypeGrid} add={addProductType} update={updateProductType} />
    </>
  )
}

export default ProductType