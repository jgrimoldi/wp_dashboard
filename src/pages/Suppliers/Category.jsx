import React, { useEffect, useState, useRef } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../../components';
import { categoryGrid, regEx } from '../../data/dummy';
import { URL_CATEGORY } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataByIdFrom, getDataFrom } from '../../services/GdrService';
import { insertCategory, updateCategoryById } from '../../services/SupplierService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null, edit: null });
  const [categoryData, setCategoryData] = useState([]);
  const [newCategory, setNewCategory] = useState(initialState);
  const [details, setDetails] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getCategories = async () => {
      await getDataFrom(URL_CATEGORY, signal, auth.token)
        .then(response => {
          setCategoryData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getCategories();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const clearInputs = () => {
    setNewCategory(initialState);
    setDetails(initialState);
  }

  const addCategory = async () => {
    if (newCategory.error === false && details.error === false) {
      await insertCategory(newCategory.value, details.value, auth.token)
        .then(response => {
          setCategoryData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_CATEGORIA_PROVEEDOR') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
            return;
          }
          setBanner({ ...banner, valid: false, error: true });
        })
        .finally(() => {
          clearInputs();
          refFocus.current.focus();
        })
    } else {
      setBanner({ ...banner, valid: false, error: true });
    }
  }

  const confirmDelete = () => {
    const objectsId = categoryData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_CATEGORY, openModal.value, auth.token)
      .then(() => {
        setCategoryData(current => current.filter(category => category.id !== Number(openModal.value)));
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
    await getDataByIdFrom(URL_CATEGORY, idSelected, auth.token)
      .then(response => {
        setNewCategory({ ...newCategory, value: response.data.nombre });
        setDetails({ ...details, value: response.data.descripcion });
      })
      .catch(() => {
        setNewCategory({ ...newCategory, value: '' });
        setDetails({ ...details, value: '' });
      })
      .finally(() => {
        setEdit(true);
        refFocus.current.focus();
      })
  }

  const editCategory = async () => {
    await updateCategoryById(idSelected, newCategory.value, details.value, auth.token)
      .then(() => {
        const selected = categoryData.find(category => category.id === Number(idSelected));
        selected.nombre = newCategory.value;
        selected.descripcion = details.value;
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
      <SEO title='Categoria de proveedores' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.edit === true && <Banner text='¡Registro editado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, edit: false })} />}
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nueva categoría de proveedor agregada!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Lista de" title="Insumos" />
        <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
          <Input id='category' useRef={refFocus} label='Nueva categoría de proveedor' size='small' css='w-full sm:w-2/5' required={true} state={newCategory} setState={setNewCategory} regEx={regEx.notEmpty} />
          <Input id='details' label='Detalles de la categoría' size='small' css='w-full sm:w-2/5' required={true} state={details} setState={setDetails} regEx={regEx.notEmpty} />
          {edit === true ? <Button customFunction={editCategory} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar categoría de proveedor' />
            : <Button customFunction={addCategory} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar categoría de proveedor' />}
        </div>
        <Table header={categoryGrid} data={categoryData} filterTitle='Categoría de Proveedores' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
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
