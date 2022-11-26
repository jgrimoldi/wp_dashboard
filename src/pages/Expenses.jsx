import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Title, Table, Input, Button, Modal, Banner, SerialNumber, Select } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { expenseGrid, regEx } from '../data/dummy';
import { URL_CLIENT, URL_PRODUCT, URL_STORAGE, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const MakeInputs = ({ configInputs }) => (
  <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
    {configInputs.map((input, index) => {
      const { getter, url, field, id, useRef, type, label, disabled, state, setState, expression, helperText, css } = input;
      return (
        <span className={css} key={index}>
          {field
            ? <Input id={id} useRef={useRef} type={type} label={label} size='small'
              required={true} disabled={disabled}
              state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
            : <Select id={id} label={label} url={url} state={state} setState={setState} getter={getter} />}
        </span>
      )
    })}
  </div>
)

const Expenses = () => {
  const { themeColors } = useStateContext();
  const { auth } = useAuthContext();
  const date = new Date();
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  const initialState = { value: '', error: null };
  const createBanner = { text: 'Egreso registrado exitosamente!', background: themeColors?.confirm }
  const invalidSeries = { text: '¡Ups! Las series no estan completas.', background: '#FFC300' }
  const warningQuantity = { text: 'Atención! No hay unidades del producto', background: '#FFC300' }
  const warningStock = { text: 'Atención! Producto por debajo del stock.', background: '#FFC300' }
  const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
  const updateBanner = { text: '¡Registro editado exitosamente!', background: themeColors?.confirm }
  const deleteBanner = { text: 'Producto eliminado del egreso exitosamente!', background: themeColors?.confirm }
  const [recordsData, setRecordsData] = useState([]);
  const [client, setClient] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [purchaseDate, setPurchaseDate] = useState({ value: formatedDate, error: false });
  const [detailsProduct, setDetailsProduct] = useState('');
  const [detailsQuantity, setDetailsQuantity] = useState(initialState);
  const [incomeSerialNumbers, setIncomeSerialNumbers] = useState([]);
  // const [subTotalPrice, setSubTotalPrice] = useState(0);
  // const [totalVATPrice, setTotalVATPrice] = useState(0);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [productID, setProductID] = useState('');
  const [openSerialNumber, setOpenSerialNumber] = useState(null);
  const [banner, setBanner] = useState(initialState);
  const [openModal, setOpenModal] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [edit, setEdit] = useState(null);
  const inputPurchase = [
    { getter: 'nombre', url: URL_CLIENT, id: 'client', label: 'Cliente', state: client, setState: setClient, expression: 'notEmpty', css: 'w-1/6' },
    { getter: 'nombre', url: URL_STORAGE, id: 'warehouse', label: 'Almacén', state: warehouse, setState: setWarehouse, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'date', id: 'date', type: 'date', state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/6' },
  ];
  const inputsDetails = [
    { getter: 'nombre', url: URL_PRODUCT, id: 'product', label: 'Producto', state: detailsProduct, setState: setDetailsProduct, expression: 'notEmpty', css: 'w-2/6' },
    { field: 'quantity', id: 'quantity', type: 'number', label: 'Unidades', state: detailsQuantity, setState: setDetailsQuantity, expression: 'digitsRegExp', css: 'w-1/6' },
  ]

  useEffect(() => {
    let shadowBanner = setTimeout(() => setBanner({ error: null }), 4000);
    return () => { clearTimeout(shadowBanner) };
  });

  const clearInputs = () => {
    setDetailsProduct({ id: '' })
    setDetailsQuantity(initialState)
    setOpenModal(initialState);
    setIdSelected('');
    setEdit(null);
  }

  function validateQuantity(quantityToExpense) {
    return Number(detailsQuantity.value) <= quantityToExpense
  }

  function checkStockOn(productID) {
    if (productID === detailsProduct.id) {
      const quantityOnProduct = detailsProduct.cantidad - Number(detailsQuantity.value);
      const stockMin = detailsProduct.stockmin >= quantityOnProduct;

      if (quantityOnProduct < 0) {
        const error = { text: 'Ups! La cantidad supera las unidades del producto.', background: themeColors?.error }
        throw error;
      }
      if (stockMin) {
        setBanner({ ...banner, value: warningStock, error: true })
      }
      if (quantityOnProduct === 0) {
        setBanner({ ...banner, value: warningQuantity, error: true })
      }
    } else {
      setBanner({ ...banner, value: errorBanner, error: true })
    }
  }

  function validateAdd(productInfo) {
    if (validateQuantity(productInfo.cantidad)) {
      checkStockOn(productInfo.id_producto)
    } else {
      const error = { text: 'Ups! La cantidad a egresar es mayor a la cantidad en almacén.', background: themeColors?.error }
      throw error;
    }
  }

  class ProductExpense {
    constructor(fk_producto, fk_almacen, product, quantity, units, price) {
      this.fk_producto = fk_producto;
      this.fk_almacen = fk_almacen;
      this.product = product;
      this.quantity = quantity;
      this.units = units;
      this.price = price;
    }
    id = Math.ceil(Math.random() * 10000);
  }

  function addNewProduct(expenseInfo, productObject, quantityToAdd) {
    const newProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_almacen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio);
    setRecordsData([...recordsData, newProduct])
  }

  const addToExpense = () => {
    if (warehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + warehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          validateAdd(response.data[0])
          addNewProduct(response.data[0], detailsProduct, detailsQuantity.value)
          await new Promise(r => setTimeout(r, 2000));
          setBanner({ ...banner, value: createBanner, error: true })
          clearInputs()
        })
        .catch(error => {
          if (!!error?.text) {
            setBanner({ ...banner, value: error, error: true })
          } else {
            setBanner({ ...banner, value: errorBanner, error: true })
          }
        })
    } else {
      setBanner({ ...banner, value: errorBanner, error: true });
    }
  }

  const deleteDataById = () => {
    // const objectDeleted = recordsData.find(object => object.id === Number(openModal.value));
    // setSubTotalPrice((prevState) => prevState -= Number(objectDeleted.price));
    // setTotalVATPrice((prevState) => prevState -= Number(objectDeleted.VAT));
    // setTotalPrice((prevState) => prevState -= Number(objectDeleted.subTotal));
    setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
    setOpenModal(initialState);
    setBanner({ ...banner, value: deleteBanner, error: false });
  }

  const confirmDelete = () => {
    const objectsId = recordsData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, error: false });
  }

  const editInputs = async () => {
    const objectToEdit = recordsData.find(object => Number(object.id) === Number(idSelected));
    await getDataByIdFrom(URL_PRODUCT, objectToEdit.fk_producto, auth.token)
      .then(res => setDetailsProduct(Object.assign(res.data[0], { error: false })))

    setDetailsQuantity({ value: objectToEdit.quantity, error: false })
    setEdit(true);
  }

  function editProduct(expenseInfo, productObject, quantityToAdd) {
    const editedProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_almacen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio);
    const newState = recordsData.map(object => {
      if (Number(object.id) === Number(idSelected)) {
        return editedProduct
      }
      return object
    })

    setRecordsData(newState)
  }

  const updateCartRecord = () => {
    if (warehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + warehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          validateAdd(response.data[0])
          editProduct(response.data[0], detailsProduct, detailsQuantity.value)
          await new Promise(r => setTimeout(r, 2000));
          setBanner({ ...banner, value: updateBanner, error: false });
          clearInputs()
        })
        .catch(error => {
          if (!!error?.text) {
            setBanner({ ...banner, value: error, error: true })
          } else {
            setBanner({ ...banner, value: errorBanner, error: true })
          }
        })
    } else {
      setBanner({ ...banner, value: errorBanner, error: true });
    }
  }

  const generateExpense = async () => {

  }
  return (
    <>
      <>
        {openSerialNumber === true && <SerialNumber warehouse={warehouse.id} product={recordsData.find(object => object.id === productID)} state={incomeSerialNumbers} setState={setIncomeSerialNumbers} setClose={setOpenSerialNumber} />}
        {openModal.error === false &&
          <Modal
            title='¿Está seguro que quiere eliminar este registro?'
            text={`El siguiente elemento esta a punto de ser eliminado, ¿Desea continuar?`}
            buttonText='Eliminar registro' color={themeColors?.error} icon={<BsXCircle />}
            setFunction={clearInputs} redirect='' customFunction={deleteDataById}
          />}
        {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
        <SEO title='Egreso de productos' />
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
          <Title category='Egreso de' title='Productos' />
          <MakeInputs configInputs={inputPurchase} />
          {purchaseDate.error === false && !!client.nombre && !!warehouse.nombre &&
            <>
              <MakeInputs configInputs={inputsDetails} />
              <div className='w-full flex justify-center pb-4'>
                {edit === true
                  ? <Button customFunction={updateCartRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Editar registro' />
                  : <Button customFunction={addToExpense} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Agregar registro' />}
              </div>
            </>
          }
          <Table
            header={expenseGrid} data={recordsData} filterTitle='Mis Items'
            checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected}
            barcode={true} setOpenBarcode={setOpenSerialNumber} setProductID={setProductID}
          />
          {!!idSelected &&
            <div className='w-full flex sm:justify-end mt-5'>
              <div className='w-full sm:w-3/5 grid grid-cols-3 gap-1 '>
                <Button customFunction={clearInputs} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='full' text='Cancelar' />
                <Button customFunction={editInputs} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full' text='Editar' icon={<BsPencil />} />
                <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full' text='Eliminar' icon={<BsTrash />} />
              </div>
            </div>
          }
          <div style={{ color: themeColors?.highEmphasis }} className='w-full flex flex-col gap-2 pt-8'>
            {/* <div className='flex justify-end items-center gap-2 text-2xl'>
              <span className='font-semibold tracking-wide uppercase'>SubTotal:</span>
              <span className='font-[monospace] text-3xl'>$ {subTotalPrice.toFixed(2)}</span>
            </div>
            <div className='flex justify-end items-center gap-2 text-2xl'>
              <span className='font-semibold tracking-wide uppercase'>Total IVA:</span>
              <span className='font-[monospace] text-3xl'>$ {totalVATPrice.toFixed(2)}</span>
            </div>
            <div className='flex justify-end items-center gap-2 text-2xl'>
              <span className='font-semibold tracking-wide uppercase'>Total:</span>
              <span className='font-[monospace] text-3xl'>$ {totalPrice.toFixed(2)}</span>
            </div> */}
            <div className='w-full flex justify-center'>
              <Button customFunction={generateExpense} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/4' text='Generar greso' />
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default Expenses