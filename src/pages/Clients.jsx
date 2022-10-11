import React, { useEffect, useState } from 'react';
import { BsXCircle, BsTrash } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../components';
import { clientsGrid, regEx } from '../data/dummy';
import { URL_CLIENT } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../services/GdrService';
import { insertClient } from '../services/ClientService';

const Clients = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null });
  const [clientsData, setClientsData] = useState([]);

  const [id, setId] = useState({ value: '', error: null });
  const [newClient, setNewClient] = useState({ value: '', error: null });
  const [newAddress, setNewAddress] = useState({ value: '', error: null });
  const [newZip, setNewZip] = useState({ value: '', error: null });
  const [newPhone, setNewPhone] = useState({ value: '', error: null });
  const [newEmail, setNewEmail] = useState({ value: '', error: null });
  const [newComments, setNewComments] = useState({ value: '', error: null });

  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });

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

  const addClient = async () => {
    if (id.error === false && newClient.error === false && newAddress.error === false && newZip.error === false && newPhone.error === false && newEmail.error === false && newComments.error === false) {
      await insertClient(Number(id.value), newClient.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, newComments.value, auth.token)
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

  // TODO: hacer id autoincremental o que devuelva un error que indique que ese id ya esta utlizado

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
          <Input id='id' type='number' label='ID cliente' size='small' required={true} state={id} setState={setId} regEx={regEx.notEmpty} />
          <Input id='client' label='Nuevo cliente' size='small' css='w-1/3' required={true} state={newClient} setState={setNewClient} regEx={regEx.notEmpty} />
          <Input id='address' label='Dirección' size='small' css='w-1/3' required={true} state={newAddress} setState={setNewAddress} regEx={regEx.notEmpty} />
          <Input id='zip' label='Ciudad/Código postal' size='small' required={true} state={newZip} setState={setNewZip} regEx={regEx.notEmpty} />
          <Input id='phone' type='number' label='Número de telefono' size='small' required={true} state={newPhone} setState={setNewPhone} regEx={regEx.digitsRegExp} />
          <Input id='email' type='email' label='Correo electrónico' css='w-1/3' size='small' required={true} state={newEmail} setState={setNewEmail} regEx={regEx.email} />
          <Input id='comments' label='Observaciones' size='small' css='w-1/2' required={true} state={newComments} setState={setNewComments} regEx={regEx.notEmpty} />
          <Button customFunction={addClient} borderColor='blue' color='white' backgroundColor='blue' width='1/4' text='Agregar cliente' />
        </div>
        <Table header={clientsGrid} data={clientsData} filterTitle='Mis Clientes' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => setIdSelected('')} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default Clients