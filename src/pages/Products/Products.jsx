import React, { useState, useRef } from 'react';

import { SEO, Crud, BarCode } from '../../components';
import { productsGrid } from '../../data/dummy';
import { URL_PRODUCT, URL_PRODUCTTYPE, URL_UNIT, URL_VAT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { insertProduct, updateProductById } from '../../services/ProductService';

const Products = () => {
  const { auth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newProductType, setNewProductType] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newAlicuota, setNewAlicuota] = useState('');
  const [newProduct, setNewProduct] = useState(initialState);
  const [newQuantity, setNewQuantity] = useState(initialState);
  const [newMin, setNewMin] = useState(initialState);
  const [newMax, setNewMax] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const [productID, setProductID] = useState('');
  const [openBarcode, setOpenBarcode] = useState(null);
  const inputConfig = [
    { getter: 'nombre',url: URL_PRODUCTTYPE, id: 'type', label: 'Tipo de producto', state: newProductType, setState: setNewProductType, expression: 'notEmpty', css: 'w-5/6 sm:w-1/4' },
    { getter: 'magnitud',url: URL_UNIT, id: 'unit', label: 'Unidad de medida', state: newUnit, setState: setNewUnit, expression: 'notEmpty', css: 'w-1/3 sm:w-1/4' },
    { getter: 'alicuota',url: URL_VAT, id: 'alicuota', label: 'Alicuota', state: newAlicuota, setState: setNewAlicuota, expression: 'notEmpty', css: 'w-1/3 sm:w-1/4' },
    { field: 'nombre', id: 'product', useRef: refFocus, label: 'Nuevo producto', state: newProduct, setState: setNewProduct, expression: 'notEmpty', css: 'w-5/6 sm:w-1/3' },
    { field: 'cantidad', id: 'quantity', type: 'number', label: 'Cantidad', state: newQuantity, setState: setNewQuantity, expression: 'digitsRegExp', css: 'w-1/4' },
    { field: 'stockmin', id: 'min', type: 'number', label: 'Stock mínimo', state: newMin, setState: setNewMin, expression: 'digitsRegExp', css: 'w-1/4' },
    { field: 'stockmax', id: 'max', type: 'number', label: 'Stock máximo', state: newMax, setState: setNewMax, expression: 'digitsRegExp', css: 'w-1/4' },
    { field: 'descripcion', id: 'comments', label: 'Observaciones', state: details, setState: setDetails, expression: 'notEmpty', css: 'w-5/6 sm:w-1/3' },
  ];

  const addProduct = async () => {
    const response = await insertProduct(Number(newProductType.id), Number(newUnit.id), Number(newAlicuota.id), newProduct.value, newQuantity.value, newMin.value, newMax.value, details.value, auth.token);
    return await response;
  }

  const updateProduct = async (id) => {
    const response = await updateProductById(id, Number(newProductType.id), Number(newUnit.id), Number(newAlicuota.id), newProduct.value, newQuantity.value, newMin.value, newMax.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Productos' />
      {openBarcode === true && <BarCode productID={productID} setState={setOpenBarcode} />}
      <Crud title='Productos' config={inputConfig} URL={URL_PRODUCT} grid={productsGrid} add={addProduct} update={updateProduct} barcode={true} setOpen={setOpenBarcode} setProductID={setProductID} />
    </>
  )
}

export default Products