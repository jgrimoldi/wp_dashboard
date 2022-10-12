import React, { useEffect, useState } from 'react';
import { BsXCircle, BsTrash, BsSearch } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal, Searcher } from '../../components';
import { productsGrid, productsTypeSearcherGrid, regEx, unitsSearcherGrid, vatGrid } from '../../data/dummy';
import { URL_PRODUCT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../../services/GdrService';
import { insertProduct } from '../../services/ProductService';

const Products = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [productsData, setProductsData] = useState([]);

  const [newProductType, setNewProductType] = useState({ value: '', error: null });
  const [newUnit, setNewUnit] = useState({ value: '', error: null });
  const [newAlicuota, setNewAlicuota] = useState({ value: '', error: null });
  const [newProduct, setNewProduct] = useState({ value: '', error: null });
  const [newQuantity, setNewQuantity] = useState({ value: '', error: null });
  const [newMin, setNewMin] = useState({ value: '', error: null });
  const [newMax, setNewMax] = useState({ value: '', error: null });
  const [newComment, setNewComment] = useState({ value: '', error: null });
  const [showProductType, setShowProductType] = useState(null)
  const [showUnit, setShowUnit] = useState(null)
  const [showAlicuota, setShowAlicuota] = useState(null)

  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });

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

  const addProduct = async () => {
    if (newProductType.error === false && newUnit.error === false && newAlicuota.error === false && newProduct.error === false && newQuantity.error === false && newMin.error === false && newMax.error === false && newComment.error === false) {
      await insertProduct(Number(newProductType.value), Number(newUnit.value), Number(newAlicuota.value), newProduct.value, newQuantity.value, newMin.value, newMax.value, newComment.value, auth.token)
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
    } else {
      console.log('aca')
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

  return (
    <>
      <SEO title='Productos' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nuevo producto agregado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      {showProductType === true && <Searcher header={productsTypeSearcherGrid} filter='Tipo de producto' setValue={setNewProductType} setShowModal={setShowProductType} />}
      {showUnit === true && <Searcher header={unitsSearcherGrid} filter='Unidad de medida' setValue={setNewUnit} setShowModal={setShowUnit} />}
      {showAlicuota === true && <Searcher header={vatGrid} filter='Alicuota' setValue={setNewAlicuota} setShowModal={setShowAlicuota} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Productos" />
        <div className='w-full flex justify-center flex-wrap gap-2 pb-5'>
          <Input
            id='type' type='number' label='Tipo de producto' size='small' required={true}
            state={newProductType} setState={setNewProductType} regEx={regEx.digitsRegExp}
            tooltip='Buscar en tipos de productos' customFunction={() => setShowProductType(true)} color='blue' icon={<BsSearch />}
          />
          <Input
            id='unit' type='number' label='Unidad de medida' size='small' required={true}
            state={newUnit} setState={setNewUnit} regEx={regEx.digitsRegExp}
            tooltip='Bucar en unidad de medida' customFunction={() => setShowUnit(true)} color='blue' icon={<BsSearch />}
          />
          <Input
            id='alicuota' type='number' label='Alicuota' size='small' required={true}
            state={newAlicuota} setState={setNewAlicuota} regEx={regEx.digitsRegExp}
            tooltip='Buscar en alicuota' customFunction={() => setShowAlicuota(true)} color='blue' icon={<BsSearch />}
          />
          <Input
            id='product' label='Nuevo producto' size='small' required={true} css='w-1/2'
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
          <Button customFunction={addProduct} borderColor='blue' color='white' backgroundColor='blue' width='1/4' text='Agregar producto' />
        </div>
        <Table header={productsGrid} data={productsData} filterTitle='Mis Productos' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => setIdSelected('')} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default Products