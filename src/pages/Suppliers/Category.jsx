import React, { useState, useRef } from 'react';

import { SEO, Crud } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { categoryGrid } from '../../data/dummy';
import { URL_CATEGORY } from '../../services/Api';
import { insertCategory, updateCategoryById } from '../../services/SupplierService';

const Products = () => {
  const { auth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newCategory, setNewCategory] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const inputConfig = [
    { field: 'nombre', id: 'category', useRef: refFocus, label: 'Nueva categoría de proveedor', state: newCategory, setState: setNewCategory, expression: 'notEmpty', css: '' },
    { field: 'descripcion', id: 'details', label: 'Detalles de la categoría', state: details, setState: setDetails, expression: 'notEmpty', css: '' },
  ];

  const addCategory = async () => {
    const response = await insertCategory(newCategory.value, details.value, auth.token)
    return await response;
  }

  const updateCategory = async (id) => {
    const response = await updateCategoryById(id, newCategory.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Categoria de proveedores' />
      <Crud sufix='Categoría de' title='Proveedores' config={inputConfig} URL={URL_CATEGORY} grid={categoryGrid} add={addCategory} update={updateCategory} />
    </>
  )
}

export default Products
