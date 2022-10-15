import React, { useState, useRef } from 'react';

import { SEO, Crud } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { providersGrid } from '../../data/dummy';
import { URL_SUPPLIER, URL_CATEGORY } from '../../services/Api';
import { insertSupplier, updateSupplierById } from '../../services/SupplierService';

const Products = () => {
  const { auth } = useAuthContext();
  const addFocus = useRef(null);
  const editFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newId, setNewId] = useState(initialState);
  const [newCategory, setNewCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState(initialState);
  const [newAddress, setNewAddress] = useState(initialState);
  const [newZip, setNewZip] = useState(initialState);
  const [newPhone, setNewPhone] = useState(initialState);
  const [newEmail, setNewEmail] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const inputConfig = [
    { field: 'id', id: 'id', useRef: addFocus, type: 'number', label: 'ID proveedor', disabled: true, state: newId, setState: setNewId, expression: 'notEmpty', css: '' },
    { url: URL_CATEGORY, id: 'category', label: 'Categoría proveedor', state: newCategory, setState: setNewCategory, expression: 'notEmpty', css: '' },
    { field: 'nombre', id: 'supplier', useRef: editFocus, label: 'Nuevo proveedor', state: newSupplier, setState: setNewSupplier, expression: 'notEmpty', css: '' },
    { field: 'direccion', id: 'address', label: 'Dirección', state: newAddress, setState: setNewAddress, expression: 'notEmpty', css: '' },
    { field: 'cp', id: 'zip', label: 'Código postal/Ciudad', state: newZip, setState: setNewZip, expression: 'notEmpty', css: '' },
    { field: 'tel', id: 'phone', type: 'number', label: 'Número de teléfono', state: newPhone, setState: setNewPhone, expression: 'digitsRegExp', css: '' },
    { field: 'email', id: 'email', type: 'email', label: 'Correo eléctronico', state: newEmail, setState: setNewEmail, expression: 'email', css: '' },
    { field: 'observaciones', id: 'comments', label: 'Observaciones', state: details, setState: setDetails, expression: 'notEmpty', css: '' },
  ];


  const addSupplier = async () => {
    const response = await insertSupplier(Number(newId.value), Number(newCategory.id), newSupplier.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, details.value, auth.token);
    return await response;
  }


  const updateClient = async (id) => {
    const response = await updateSupplierById(id, newCategory.id, newSupplier.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Proveedores' />
      <Crud title='Proveedores' config={inputConfig} URL={URL_SUPPLIER} grid={providersGrid} add={addSupplier} update={updateClient} />
    </>
  )
}

export default Products
