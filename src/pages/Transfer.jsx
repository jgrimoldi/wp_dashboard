import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil, BsSearch } from 'react-icons/bs';

import { SEO, Title, Table, Input, Button, Modal, Banner, ExpenseSerial, Select, ProductSearcher } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { expenseGrid, regEx } from '../data/dummy';
import { URL_PRODUCT, URL_SN, URL_STORAGE, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';
import { insertNewTransfer } from '../services/MovsService';

const MakeInputs = ({ configInputs }) => {
  const { themeColors } = useStateContext();

  return (
    <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
      {configInputs.map((input, index) => {
        const { getter, url, field, id, useRef, type, label, disabled, state, setState, expression, helperText, css, tooltip, customFunction, customFilter } = input;
        return (
          <span className={css} key={index}>
            {field
              ? <Input id={id} useRef={useRef} type={type} label={label} size='small'
                required={true} disabled={disabled}
                state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
              :
              <div className='flex gap-2'>
                <Select id={id} label={label} url={url} state={state} setState={setState} disabled={disabled} getter={getter} customFilter={customFilter} />
                {tooltip &&
                  <TooltipComponent content={tooltip} position="TopCenter">
                    <button type='button' onClick={customFunction} style={{ backgroundColor: themeColors?.secondary }} className='relative p-2 text-white dark:text-black text-2xl rounded-md'>
                      <BsSearch />
                    </button>
                  </TooltipComponent>
                }
              </div>
            }
          </span>
        )
      })}
    </div>
  )
}

const Transfer = () => {
  const { themeColors } = useStateContext();
  const { auth } = useAuthContext();
  const date = new Date();
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  const initialState = { value: '', error: null };
  const createBanner = { text: 'Transferencia registrada exitosamente!', background: themeColors?.confirm }
  const invalidSeries = { text: '¡Ups! Las series no estan completas.', background: '#FFC300' }
  const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
  const updateBanner = { text: '¡Registro editado exitosamente!', background: themeColors?.confirm }
  const deleteBanner = { text: 'Producto eliminado de los movimientos exitosamente!', background: themeColors?.confirm }
  const [recordsData, setRecordsData] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [destinationWarehouse, setDestinationWarehouse] = useState('');
  const [comments, setComments] = useState(initialState);
  const [purchaseDate, setPurchaseDate] = useState({ value: formatedDate, error: false });
  const [detailsProduct, setDetailsProduct] = useState('');
  const [detailsQuantity, setDetailsQuantity] = useState(initialState);
  const [expenseSerials, setExpenseSerials] = useState([]);
  const [productID, setProductID] = useState('');
  const [openSerialNumber, setOpenSerialNumber] = useState(null);
  const [banner, setBanner] = useState(initialState);
  const [openModal, setOpenModal] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [edit, setEdit] = useState(null);
  const [openSearcher, setOpenSearcher] = useState(false);
  const inputPurchase = [
    { getter: 'nombre', url: URL_STORAGE, id: 'sourceWarehouse', label: 'Almacén Origen', state: sourceWarehouse, setState: setSourceWarehouse, disabled: recordsData.length > 0, expression: 'notEmpty', css: 'w-1/5' },
    { getter: 'nombre', url: URL_STORAGE, id: 'destinationWarehouse', label: 'Almacén Destino', state: destinationWarehouse, setState: setDestinationWarehouse, expression: 'notEmpty', css: 'w-1/5', customFilter: item => item.id !== sourceWarehouse.id },
    { field: 'comments', id: 'comments', type: 'text', label: 'Detalle del Movimiento', state: comments, setState: setComments, expression: 'notEmpty', css: 'w-1/5' },
    { field: 'date', id: 'date', type: 'date', state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/8' },
  ];
  const inputsDetails = [
    { getter: 'nombre', url: URL_PRODUCT, id: 'product', label: 'Producto', state: detailsProduct, setState: setDetailsProduct, expression: 'notEmpty', css: 'w-2/6', tooltip: 'Abrir buscador', customFunction: () => setOpenSearcher(!openSearcher) },
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
    setOpenSearcher(false)
    setEdit(null);
  }

  function validateIfExists(product) {
    const datos = recordsData.map(item => item.fk_producto);
    if (datos.includes(product.id_producto)) {
      const error = { text: `Ups! El producto ya se encuentra en la lista`, background: themeColors?.error }
      throw error;
    }
  }

  function validateQuantity(quantityToExpense) {
    return Number(detailsQuantity.value) <= quantityToExpense
  }

  async function checkStockOn(aProduct) {
    if (aProduct.id_producto === detailsProduct.id) {
      const quantityOnProduct = aProduct.cantidad - Number(detailsQuantity.value);
      const stockMin = detailsProduct.stockmin >= quantityOnProduct;
      if (stockMin) {
        setBanner({ ...banner, value: { text: `Atención! Producto por debajo del stock. Stock mínimo: ${detailsProduct.stockmin}. Unidades en el ${sourceWarehouse.nombre}: ${quantityOnProduct}`, background: '#FFC300' }, error: false })
      }
      await new Promise(r => setTimeout(r, 4000));
      if (quantityOnProduct === 0) {
        setBanner({ ...banner, value: { text: `Atención! Todas las unidades faltantes fueron seleccionadas. Unidades en el almacén: ${quantityOnProduct}`, background: '#FFC300' }, error: false })
      }

    } else {
      const error = { text: `Ups! Ocurrió un error al seleccionar el producto`, background: themeColors?.error }
      throw error;
    }
  }

  function checkMaxStock(aProduct) {
    if (aProduct.id_producto === detailsProduct.id) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + destinationWarehouse.id + '/', aProduct.id_producto, auth.token)
        .then(async response => {
          const quantityOnProduct = response.data[0].cantidad + Number(detailsQuantity.value);
          const stockMax = detailsProduct.stockmax <= quantityOnProduct;
          if (stockMax) {
            setBanner({ ...banner, value: { text: `Atención! Producto por encima del stock. Stock máximo: ${detailsProduct.stockmax}. Unidades en el ${destinationWarehouse.nombre}: ${quantityOnProduct}`, background: '#FFC300' }, error: false })
          }
        })
        .catch(() => {
          const error = { text: `Ups! Ocurrió un error al seleccionar el producto`, background: themeColors?.error }
          throw error;
        })
    } else {
      const error = { text: `Ups! Ocurrió un error al seleccionar el producto`, background: themeColors?.error }
      throw error;
    }
  }

  async function validateAdd(productInfo) {
    if (validateQuantity(productInfo.cantidad)) {
      checkStockOn(productInfo)
      await new Promise(r => setTimeout(r, 2000));
      checkMaxStock(productInfo)
    } else {
      const error = { text: `Ups! La cantidad a egresar es mayor a la cantidad en almacén. Cantidad en almacén: ${productInfo.cantidad}`, background: themeColors?.error }
      throw error;
    }
  }

  class ProductExpense {
    constructor(fk_producto, fk_almacen, product, quantity, units, price) {
      this.fk_producto = fk_producto;
      this.fk_almacen = fk_almacen;
      this.product = product;
      this.quantity = Number(quantity);
      this.units = units;
      this.price = Number(price);
      this.subTotal = (Number(this.quantity) * Number(this.price)).toFixed(2);
    }
    id = Math.ceil(Math.random() * 10000);
  }

  function addNewProduct(expenseInfo, productObject, quantityToAdd) {
    const newProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_alamcen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio);
    setRecordsData([...recordsData, newProduct])
  }

  const addToExpense = () => {
    if (sourceWarehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + sourceWarehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          validateIfExists(response.data[0])
          validateAdd(response.data[0])
          addNewProduct(response.data[0], detailsProduct, detailsQuantity.value)
          await new Promise(r => setTimeout(r, 6000));
          setBanner({ ...banner, value: { text: 'Item agregado correctamente!', background: themeColors?.confirm }, error: true })
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
    const objectDeleted = recordsData.find(object => object.id === Number(openModal.value));
    setExpenseSerials(current => current.filter(record => record.fk_producto !== Number(objectDeleted.fk_producto)))
    setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
    setOpenModal(initialState);
    clearInputs();
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
    const editedProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_alamcen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio);
    const newState = recordsData.map(object => {
      if (Number(object.id) === Number(idSelected)) {
        return editedProduct
      }
      return object
    })

    setRecordsData(newState)
  }

  const updateCartRecord = () => {
    if (sourceWarehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + sourceWarehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          const objectToEdit = recordsData.find(object => Number(object.id) === Number(idSelected));
          validateAdd(response.data[0])
          if (detailsQuantity.value < objectToEdit.quantity && expenseSerials.find(item => item.fk_producto === detailsProduct.id)) {
            setBanner({ ...banner, value: { text: `Atención! Nueva cantidad menor a la anterior. Verifique los números de serie.`, background: '#FFC300' }, error: true })
          }
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

  async function getSerials() {
    const products = [];
    await Promise.all(recordsData.map(obj =>
      getDataByIdFrom(`${URL_SN}q/productoalmacen/${obj.fk_producto}/${sourceWarehouse.id}/`, 0, auth.token)
        .then(response => {
          products.push(response.data);
        })
    ));
    return products;
  }

  async function areSerialsComplete() {
    const totalSerials = (await getSerials()).flat().map(item => item.sn);
    const fkProducts = (await getSerials()).flat().map(item => item.id_producto)
    const prods = recordsData.filter(item => fkProducts.includes(item.fk_producto)).reduce((a, b) => a.quantity + b.quantity, 0)
    let areIncluded = true;

    expenseSerials.forEach(item => {
      areIncluded = areIncluded && totalSerials.includes(item.sn)
    })

    return areIncluded && prods === expenseSerials.length
  }


  function generateNewTransfer() {
    return { fk_almacen_origen: sourceWarehouse.id, fk_almacen_destino: destinationWarehouse.id, fechamovimiento: purchaseDate.value, detalle: comments.value }
  }

  function generateDetails() {
    const aux = []

    recordsData.forEach(record => {
      aux.push({ fk_producto: record.fk_producto, cantidad: record.quantity, cmp: record.price, total: record.subTotal })
    })

    return aux
  }

  function generateSerials() {
    const aux = []

    expenseSerials.forEach(record => {
      aux.push({ fk_producto: record.fk_producto, sn: record.sn })
    })

    return aux
  }

  const generateTransfer = async () => {
    if (areSerialsComplete()) {
      if (sourceWarehouse.id !== destinationWarehouse && (!!comments.value || comments.error === false) && recordsData.length > 0) {
        insertNewTransfer(generateNewTransfer(), generateDetails(), generateSerials(), auth.token)
          .then(() => {
            setBanner({ ...banner, value: createBanner, error: false });
            setSourceWarehouse({ id: '' });
            setDestinationWarehouse({ id: '' });
            clearInputs();
            setRecordsData([]);
            setExpenseSerials([])
          })
          .catch(error => console.log(error.response.config.data)) //setBanner({ ...banner, value: errorBanner, error: true }))
      } else {
        setBanner({ ...banner, value: { text: `Ups! Ocurrió un error o al menos un campo esta vacío.`, background: themeColors?.error }, error: true })
      }
    } else {
      setBanner({ ...banner, value: invalidSeries, error: true })
    }
  }

  return (
    <>
      {openSerialNumber === true && <ExpenseSerial warehouse={sourceWarehouse.id} product={recordsData.find(object => object.id === productID)} state={expenseSerials} setState={setExpenseSerials} setClose={setOpenSerialNumber} />}
      {openModal.error === false &&
        <Modal
          title='¿Está seguro que quiere eliminar este registro?'
          text={`El siguiente elemento esta a punto de ser eliminado, ¿Desea continuar?`}
          buttonText='Eliminar registro' color={themeColors?.error} icon={<BsXCircle />}
          setFunction={clearInputs} redirect='' customFunction={deleteDataById}
        />}
      {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
      <SEO title='Transferir productos' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category='Transferencia entre' title='Almacenes' />
        <MakeInputs configInputs={inputPurchase} />
        {purchaseDate.error === false && !!sourceWarehouse.nombre && !!destinationWarehouse.nombre &&
          <>
            <MakeInputs configInputs={inputsDetails} />
            {openSearcher === true && <ProductSearcher title={`Productos en ${sourceWarehouse.nombre}`} product={detailsProduct} setProduct={setDetailsProduct} warehouse={sourceWarehouse.id} />}
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
          <div className='w-full flex justify-center'>
            <Button customFunction={generateTransfer} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/4' text='Generar transferencia' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Transfer