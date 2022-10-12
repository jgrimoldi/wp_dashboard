import React, { useEffect, useState, useRef } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal, Searcher } from '../../components';
import { providersGrid, categorySearcherGrid, regEx } from '../../data/dummy';
import { URL_SUPPLIER } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../../services/GdrService';
import { insertSupplier, updateSupplierById } from '../../services/SupplierService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const addFocus = useRef(null);
  const editFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null });
  const [providersData, setProvidersData] = useState([]);
  const [newId, setNewId] = useState(initialState);
  const [newCategory, setNewCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState(initialState);
  const [newAddress, setNewAddress] = useState(initialState);
  const [newZip, setNewZip] = useState(initialState);
  const [newPhone, setNewPhone] = useState(initialState);
  const [newEmail, setNewEmail] = useState(initialState);
  const [newComment, setNewComment] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getProviders = async () => {
      await getDataFrom(URL_SUPPLIER, signal, auth.token)
        .then(response => {
          setProvidersData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getProviders();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const clearInputs = () => {
    setNewId(initialState);
    setNewSupplier(initialState);
    setNewAddress(initialState);
    setNewZip(initialState);
    setNewPhone(initialState);
    setNewEmail(initialState);
    setNewComment(initialState);
  }

  const addSupplier = async () => {
    if (newId.error === false && !!newCategory && newSupplier.error === false && newAddress.error === false && newZip.error === false && newPhone.error === false && newEmail.error === false && newComment.error === false) {
      await insertSupplier(Number(newId.value), Number(newCategory.id), newSupplier.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, newComment.value, auth.token)
        .then(response => {
          setProvidersData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_PROVEEDOR') {
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
    const objectsId = providersData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_SUPPLIER, openModal.value, auth.token)
      .then(() => {
        setProvidersData(current => current.filter(supplier => supplier.id !== Number(openModal.value)));
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
    await getDataByIdFrom(URL_SUPPLIER, idSelected, auth.token)
      .then(response => {
        setNewId({ ...newId, value: response.data[0].id });
        setNewSupplier({ ...newSupplier, value: response.data[0].nombre });
        setNewAddress({ ...newAddress, value: response.data[0].direccion });
        setNewZip({ ...newZip, value: response.data[0].cp });
        setNewPhone({ ...newPhone, value: response.data[0].tel });
        setNewEmail({ ...newEmail, value: response.data[0].email });
        setNewComment({ ...newComment, value: response.data[0].observaciones });
      })
      .catch(() => {
        setNewId({ ...newId, value: '' });
        setNewSupplier({ ...newSupplier, value: '' });
        setNewAddress({ ...newAddress, value: '' });
        setNewZip({ ...newZip, value: '' });
        setNewPhone({ ...newPhone, value: '' });
        setNewEmail({ ...newEmail, value: '' });
        setNewComment({ ...newComment, value: '' });
      })
      .finally(() => {
        setEdit(true);
        editFocus.current.focus();
      })
  }

  const editClient = async () => {
    await updateSupplierById(idSelected, newCategory.id, newSupplier.value, newAddress.value, newZip.value, newPhone.value, newEmail.value, newComment.value, auth.token)
      .then(() => {
        const selected = providersData.find(provider => provider.id === Number(idSelected));
        selected.fk_categoria = newCategory.id;
        selected.nombre = newSupplier.value;
        selected.direccion = newAddress.value;
        selected.cp = newZip.value;
        selected.tel = newPhone.value;
        selected.email = newEmail.value;
        selected.observaciones = newComment.value;
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
      <SEO title='Proveedores' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.edit === true && <Banner text='¡Registro editado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, edit: false })} />}
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo proveedor agregado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Lista de" title="Proveedores" />
        <div className='w-full flex justify-center flex-wrap gap-2 pb-5'>
          <Input
            id='id' type='number' useRef={addFocus} label='ID proveedor' size='small' required={true} disabled={edit} css='w-1/4 sm:w-1/5'
            state={newId} setState={setNewId} regEx={regEx.notEmpty}
          />
          <Searcher id='category' label='Categoría proveedor' url={categorySearcherGrid[0][0]} state={newCategory} setState={setNewCategory} edit={edit} select={idSelected} />
          <Input
            id='supplier' useRef={editFocus} label='Nuevo proveedor' size='small' required={true} css='w-1/4 sm:w-1/2'
            state={newSupplier} setState={setNewSupplier} regEx={regEx.notEmpty}
          />
          <Input
            id='address' label='Dirección' size='small' required={true} css='w-1/4 sm:w-1/2'
            state={newAddress} setState={setNewAddress} regEx={regEx.notEmpty}
          />
          <Input
            id='zip' label='Código postal/Ciudad' size='small' required={true} css='w-1/4 sm:w-1/5'
            state={newZip} setState={setNewZip} regEx={regEx.notEmpty}
          />
          <Input
            id='phone' type='number' label='Número de teléfono' size='small' required={true} css='w-1/4 sm:w-1/5'
            state={newPhone} setState={setNewPhone} regEx={regEx.digitsRegExp}
          />
          <Input
            id='email' label='Correo eléctronico' size='small' required={true} css='w-1/4 sm:w-1/2'
            state={newEmail} setState={setNewEmail} regEx={regEx.email}
          />
          <Input
            id='comments' label='Observaciones' size='small' required={true} css='w-1/4 sm:w-2/5'
            state={newComment} setState={setNewComment} regEx={regEx.notEmpty}
          />
          {edit === true ? <Button customFunction={editClient} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar proveedor' />
            : <Button customFunction={addSupplier} borderColor='blue' color='white' backgroundColor='blue' width='1/4' text='Agregar proveedor' />}
        </div>
        <Table header={providersGrid} data={providersData} filterTitle='Mis Proveedores' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
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

export default Products
