import React, { useEffect, useState, useRef } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal, Searcher, BarCode } from '../../components';
import { productsGrid, productsTypeSearcherGrid, regEx, unitsSearcherGrid, vatGrid } from '../../data/dummy';
import { URL_PRODUCT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../../services/GdrService';
import { insertProduct, updateProductById } from '../../services/ProductService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null, edit: null });
  const [productsData, setProductsData] = useState([]);
  const [newProductType, setNewProductType] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newAlicuota, setNewAlicuota] = useState('');
  const [newProduct, setNewProduct] = useState(initialState);
  const [newQuantity, setNewQuantity] = useState(initialState);
  const [newMin, setNewMin] = useState(initialState);
  const [newMax, setNewMax] = useState(initialState);
  const [newComment, setNewComment] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

  const [productID, setProductID] = useState('');
  const [openBarcode, setOpenBarcode] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProducts = async () => {
      await getDataFrom(URL_PRODUCT, signal, auth.token)
        .then(response => {
          setProductsData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getProducts();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const clearInputs = () => {
    setNewProduct(initialState);
    setNewQuantity(initialState);
    setNewMin(initialState);
    setNewMax(initialState);
    setNewComment(initialState);
  }

  const addProduct = async () => {
    if (!!newProductType && !!newUnit && !!newAlicuota && newProduct.error === false && newQuantity.error === false && newMin.error === false && newMax.error === false && newComment.error === false) {
      await insertProduct(Number(newProductType.id), Number(newUnit.id), Number(newAlicuota.id), newProduct.value, newQuantity.value, newMin.value, newMax.value, newComment.value, auth.token)
        .then(response => {
          setProductsData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_PRODUCTO') {
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
    const objectsId = productsData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_PRODUCT, openModal.value, auth.token)
      .then(() => {
        setProductsData(current => current.filter(warehouse => warehouse.id !== Number(openModal.value)));
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
    await getDataByIdFrom(URL_PRODUCT, idSelected, auth.token)
      .then(response => {
        setNewProduct({ ...newProduct, value: response.data[0].nombre });
        setNewQuantity({ ...newQuantity, value: response.data[0].cantidad });
        setNewMin({ ...newMin, value: response.data[0].stockmin });
        setNewMax({ ...newMax, value: response.data[0].stockmax });
        setNewComment({ ...newComment, value: response.data[0].descripcion });
      })
      .catch(() => {
        setNewProductType({ ...newProductType, value: '' });
        setNewUnit({ ...newUnit, value: '' });
        setNewAlicuota({ ...newAlicuota, value: '' });
        setNewProduct({ ...newProduct, value: '' });
        setNewQuantity({ ...newQuantity, value: '' });
        setNewMin({ ...newMin, value: '' });
        setNewMax({ ...newMax, value: '' });
        setNewComment({ ...newComment, value: '' });

      })
      .finally(() => {
        setEdit(true);
        refFocus.current.focus();
      })
  }

  const editProduct = async () => {
    await updateProductById(idSelected, newProductType.id, newUnit.id, newAlicuota.id, newProduct.value, newQuantity.value, newMin.value, newMax.value, newComment.value, auth.token)
      .then(() => {
        const selected = productsData.find(product => product.id === Number(idSelected));
        selected.nombre = newProduct.value;
        selected.cantidad = newQuantity.value;
        selected.stockmin = newMin.value;
        selected.stockmax = newMax.value;
        selected.descripcion = newComment.value;
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
      <SEO title='Productos' />
      {openBarcode === true && <BarCode productID={productID} setState={setOpenBarcode} />}
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.edit === true && <Banner text='¡Registro editado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, edit: false })} />}
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo producto agregado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Productos" />
        <div className='w-full flex justify-center flex-wrap gap-2 pb-5'>
          <Searcher id='type' label='Tipo de producto' url={productsTypeSearcherGrid[0][0]} state={newProductType} setState={setNewProductType} />
          <Searcher id='unit' label='Unidad de medida' url={unitsSearcherGrid[0][0]} state={newUnit} setState={setNewUnit} getter='magnitud' />
          <Searcher id='alicuota' label='Alicuota' url={vatGrid[0][0]} state={newAlicuota} setState={setNewAlicuota} getter='alicuota' />
          <Input
            id='product' useRef={refFocus} label='Nuevo producto' size='small' required={true} css='w-full sm:w-1/3'
            state={newProduct} setState={setNewProduct} regEx={regEx.notEmpty}
          />
          <Input
            id='quantity' type='number' label='Cantidad' size='small' required={true}
            state={newQuantity} setState={setNewQuantity} regEx={regEx.digitsRegExp}
          />
          <Input
            id='min' type='number' label='Stock mínimo' size='small' required={true}
            state={newMin} setState={setNewMin} regEx={regEx.digitsRegExp}
          />
          <Input
            id='max' type='number' label='Stock máximo' size='small' required={true}
            state={newMax} setState={setNewMax} regEx={regEx.digitsRegExp}
          />
          <Input
            id='comments' label='Observaciones' size='small' required={true} css='w-1/3'
            state={newComment} setState={setNewComment} regEx={regEx.notEmpty}
          />
          {edit === true ? <Button customFunction={editProduct} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar producto' />
            : <Button customFunction={addProduct} borderColor='blue' color='white' backgroundColor='blue' width='1/4' text='Agregar producto' />}
        </div>
        <Table header={productsGrid} data={productsData} filterTitle='Mis Productos'
          checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected}
          barcode={true} setOpenBarcode={setOpenBarcode} setProductID={setProductID} />
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