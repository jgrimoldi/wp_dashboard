import React, { useState, useRef } from 'react';

import { Crud, SEO } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { clientsGrid } from '../data/dummy';
import { URL_CLIENT } from '../services/Api';
import { insertClient, updateClientById } from '../services/ClientService';

const Clients = () => {
  const { auth } = useAuthContext();
  const addFocus = useRef(null);
  const editFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newId, setNewId] = useState(initialState);
  const [newClient, setNewClient] = useState(initialState);
  const [newAddress, setNewAddress] = useState(initialState);
  const [newZip, setNewZip] = useState(initialState);
  const [newPhone, setNewPhone] = useState(initialState);
  const [newEmail, setNewEmail] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const inputConfig = [
    { field: 'id', id: 'id', useRef: addFocus, type: 'number', label: 'ID cliente', disabled: true, state: newId, setState: setNewId, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'nombre', id: 'client', useRef: editFocus, label: 'Nuevo cliente', state: newClient, setState: setNewClient, expression: 'notEmpty', css: 'sm:w-2/6' },
    { field: 'direccion', id: 'address', label: 'Dirección', state: newAddress, setState: setNewAddress, expression: 'notEmpty', css: 'w-5/6 sm:w-1/4' },
    { field: 'cp', id: 'zip', label: 'Ciudad/Código postal', state: newZip, setState: setNewZip, expression: 'notEmpty', css: 'w-5/6 sm:w-auto' },
    { field: 'tel', id: 'phone', type: 'number', label: 'Número de telefono', state: newPhone, setState: setNewPhone, expression: 'digitsRegExp', css: 'w-5/6 sm:w-1/5' },
    { field: 'email', id: 'email', type: 'email', label: 'Correo electrónico', state: newEmail, setState: setNewEmail, expression: 'email', css: 'w-5/6 sm:w-1/5' },
    { field: 'observaciones', id: 'comments', label: 'Observaciones', state: details, setState: setDetails, expression: 'notEmpty', css: 'w-5/6 sm:w-1/2' },
  ];

  const addClient = async () => {
    const response = await insertClient(Number(newId.value), newClient.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, details.value, auth.token);
    return await response;
  }

  const updateClient = async (id) => {
    const response = await updateClientById(id, newClient.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, details.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Clientes' />
      <Crud title='Clientes' config={inputConfig} URL={URL_CLIENT} grid={clientsGrid} add={addClient} update={updateClient} />
    </>
  )
}

export default Clients