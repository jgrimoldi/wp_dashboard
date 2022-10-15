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
    { getter: 'nombre',url: URL_PRODUCTTYPE, id: 'type', label: 'Tipo de producto', state: newProductType, setState: setNewProductType, expression: 'notEmpty', css: '' },
    { getter: 'magnitud',url: URL_UNIT, id: 'unit', label: 'Unidad de medida', state: newUnit, setState: setNewUnit, expression: 'notEmpty', css: '' },
    { getter: 'alicuota',url: URL_VAT, id: 'alicuota', label: 'Alicuota', state: newAlicuota, setState: setNewAlicuota, expression: 'notEmpty', css: '' },
    { field: 'nombre', id: 'product', useRef: refFocus, label: 'Nuevo producto', state: newProduct, setState: setNewProduct, expression: 'notEmpty', css: '' },
    { field: 'cantidad', id: 'quantity', type: 'number', label: 'Cantidad', state: newQuantity, setState: setNewQuantity, expression: 'digitsRegExp', css: '' },
    { field: 'stockmin', id: 'min', type: 'number', label: 'Stock mínimo', state: newMin, setState: setNewMin, expression: 'digitsRegExp', css: '' },
    { field: 'stockmax', id: 'max', type: 'number', label: 'Stock máximo', state: newMax, setState: setNewMax, expression: 'digitsRegExp', css: '' },
    { field: 'descripcion', id: 'comments', label: 'Observaciones', state: details, setState: setDetails, expression: 'notEmpty', css: '' },
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
      <Crud title='Proveedores' config={inputConfig} URL={URL_PRODUCT} grid={productsGrid} add={addProduct} update={updateProduct} barcode={true} setOpen={setOpenBarcode} setProductID={setProductID} />
    </>
  )
}

export default Products