import React, { useEffect, useState, useRef } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../components';
import { clientsGrid, regEx } from '../data/dummy';
import { URL_CLIENT } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../services/GdrService';
import { insertClient, updateClientById } from '../services/ClientService';

const Clients = () => {
  const { auth, setAuth } = useAuthContext();
  const addFocus = useRef(null);
  const editFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null });
  const [clientsData, setClientsData] = useState([]);
  const [newId, setNewId] = useState(initialState);
  const [newClient, setNewClient] = useState(initialState);
  const [newAddress, setNewAddress] = useState(initialState);
  const [newZip, setNewZip] = useState(initialState);
  const [newPhone, setNewPhone] = useState(initialState);
  const [newEmail, setNewEmail] = useState(initialState);
  const [newComments, setNewComments] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getClientes = async () => {
      await getDataFrom(URL_CLIENT, signal, auth.token)
        .then(response => {
          setClientsData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getClientes();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const clearInputs = () => {
    setNewId(initialState);
    setNewClient(initialState);
    setNewAddress(initialState);
    setNewZip(initialState);
    setNewPhone(initialState);
    setNewEmail(initialState);
    setNewComments(initialState);
  }

  const addClient = async () => {
    if (newId.error === false && newClient.error === false && newAddress.error === false && newZip.error === false && newPhone.error === false && newEmail.error === false && newComments.error === false) {
      await insertClient(Number(newId.value), newClient.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, newComments.value, auth.token)
        .then(response => {
          setClientsData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_CLIENTE') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
            return;
          }
          setBanner({ ...banner, valid: false, error: true });
        })
        .finally(() => {
          clearInputs();
          addFocus.current.focus();
        })
    } else {
      setBanner({ ...banner, valid: false, error: true });
    }
  }

  const confirmDelete = () => {
    const objectsId = clientsData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_CLIENT, openModal.value, auth.token)
      .then(() => {
        setClientsData(current => current.filter(warehouse => warehouse.id !== Number(openModal.value)));
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
    await getDataByIdFrom(URL_CLIENT, idSelected, auth.token)
      .then(response => {
        setNewId({ ...newId, value: response.data.id });
        setNewClient({ ...newClient, value: response.data.nombre });
        setNewAddress({ ...newAddress, value: response.data.direccion });
        setNewZip({ ...newZip, value: response.data.cp });
        setNewPhone({ ...newPhone, value: response.data.tel });
        setNewEmail({ ...newEmail, value: response.data.email });
        setNewComments({ ...newComments, value: response.data.observaciones });
      })
      .catch(() => {
        setNewId({ ...newId, value: '' });
        setNewClient({ ...newClient, value: '' });
        setNewAddress({ ...newAddress, value: '' });
        setNewZip({ ...newZip, value: '' });
        setNewPhone({ ...newPhone, value: '' });
        setNewEmail({ ...newEmail, value: '' });
        setNewComments({ ...newComments, value: '' });

      })
      .finally(() => {
        setEdit(true);
        editFocus.current.focus();
      })
  }

  const editClient = async () => {
    await updateClientById(idSelected, newClient.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, newComments.value, auth.token)
      .then(() => {
        const selected = clientsData.find(client => client.id === Number(idSelected));
        selected.nombre = newClient.value;
        selected.direccion = newAddress.value;
        selected.cp = newZip.value;
        selected.tel = newPhone.value;
        selected.email = newEmail.value;
        selected.observaciones = newComments.value;
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
      <SEO title='Clientes' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo cliente agregado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Clientes" />
        <div className='w-full flex justify-center flex-wrap gap-2 pb-5'>
          <Input id='id' useRef={addFocus} disabled={edit} type='number' label='ID cliente' size='small' required={true} state={newId} setState={setNewId} regEx={regEx.notEmpty} />
          <Input id='client' useRef={editFocus} label='Nuevo cliente' size='small' css='w-1/3' required={true} state={newClient} setState={setNewClient} regEx={regEx.notEmpty} />
          <Input id='address' label='Dirección' size='small' css='w-1/3' required={true} state={newAddress} setState={setNewAddress} regEx={regEx.notEmpty} />
          <Input id='zip' label='Ciudad/Código postal' size='small' required={true} state={newZip} setState={setNewZip} regEx={regEx.notEmpty} />
          <Input id='phone' type='number' label='Número de telefono' size='small' required={true} state={newPhone} setState={setNewPhone} regEx={regEx.digitsRegExp} />
          <Input id='email' type='email' label='Correo electrónico' css='w-1/3' size='small' required={true} state={newEmail} setState={setNewEmail} regEx={regEx.email} />
          <Input id='comments' label='Observaciones' size='small' css='w-1/2' required={true} state={newComments} setState={setNewComments} regEx={regEx.notEmpty} />
          {edit === true ? <Button customFunction={editClient} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar cliente' />
            : <Button customFunction={addClient} borderColor='blue' color='white' backgroundColor='blue' width='1/4' text='Agregar cliente' />}
        </div>
        <Table header={clientsGrid} data={clientsData} filterTitle='Mis Clientes' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
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

export default Clients