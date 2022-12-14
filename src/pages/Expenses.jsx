import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil, BsSearch } from 'react-icons/bs';

import { SEO, Title, Table, Input, Button, Modal, Banner, ExpenseSerial, Select, ProductSearcher } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { expenseGrid, regEx } from '../data/dummy';
import { URL_CLIENT, URL_PRODUCT, URL_SN, URL_STORAGE, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';
import { insertNewExpense } from '../services/MovsService';

const MakeInputs = ({ configInputs }) => {
  const { themeColors } = useStateContext();

  return (
    <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
      {configInputs.map((input, index) => {
        const { getter, url, field, id, useRef, type, label, disabled, state, setState, expression, helperText, css, tooltip, customFunction } = input;
        return (
          <span className={css} key={index}>
            {field
              ? <Input id={id} useRef={useRef} type={type} label={label} size='small'
                required={true} disabled={disabled}
                state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
              :
              <div className='flex gap-2'>
                <Select id={id} label={label} url={url} state={state} setState={setState} disabled={disabled} getter={getter} />
                {tooltip &&
                  <TooltipComponent content={tooltip} position="TopCenter">
                    <button type='button' onClick={customFunction} onKeyDown={(event) => event.key === 'Escape' && customFunction()} style={{ backgroundColor: themeColors?.secondary }} className='relative p-2 text-white dark:text-black text-2xl rounded-md'>
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

const Expenses = () => {
  const { themeColors } = useStateContext();
  const { auth } = useAuthContext();
  const date = new Date();
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  const initialState = { value: '', error: null };
  const createBanner = { text: 'Egreso registrado exitosamente!', background: themeColors?.confirm }
  const invalidSeries = { text: '??Ups! Las series no estan completas.', background: '#FFC300' }
  const errorBanner = { text: '??Ups! No se pudo realizar la acci??n.', background: themeColors?.error }
  const updateBanner = { text: '??Registro editado exitosamente!', background: themeColors?.confirm }
  const deleteBanner = { text: 'Producto eliminado del egreso exitosamente!', background: themeColors?.confirm }
  const [recordsData, setRecordsData] = useState([]);
  const [client, setClient] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [purchaseDate, setPurchaseDate] = useState({ value: formatedDate, error: false });
  const [detailsProduct, setDetailsProduct] = useState('');
  const [detailsQuantity, setDetailsQuantity] = useState(initialState);
  const [expenseSerials, setExpenseSerials] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productID, setProductID] = useState('');
  const [openSerialNumber, setOpenSerialNumber] = useState(null);
  const [banner, setBanner] = useState(initialState);
  const [openModal, setOpenModal] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [edit, setEdit] = useState(null);
  const [openSearcher, setOpenSearcher] = useState(false);
  const inputPurchase = [
    { getter: 'nombre', url: URL_CLIENT, id: 'client', label: 'Cliente', state: client, setState: setClient, expression: 'notEmpty', css: 'w-1/6' },
    { getter: 'nombre', url: URL_STORAGE, id: 'warehouse', label: 'Almac??n', state: warehouse, setState: setWarehouse, expression: 'notEmpty', disabled: recordsData.length > 0, css: 'w-1/6' },
    { field: 'date', id: 'date', type: 'date', state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/6' },
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
        await new Promise(r => setTimeout(r, 2500));
        setBanner({ ...banner, value: { text: `Atenci??n! Producto por debajo del stock. Stock m??nimo: ${detailsProduct.stockmin}. Unidades en el almac??n: ${quantityOnProduct}`, background: '#FFC300' }, error: true })
      }

      if (quantityOnProduct === 0) {
        await new Promise(r => setTimeout(r, 3000));
        setBanner({ ...banner, value: { text: `Atenci??n! Todas las unidades faltantes fueron seleccionadas. Unidades en el almac??n: ${quantityOnProduct}`, background: '#FFC300' }, error: true })
      }

    } else {
      const error = { text: `Ups! Ocurri?? un error al seleccionar el producto`, background: themeColors?.error }
      throw error;
    }
  }

  function validateAdd(productInfo) {
    if (validateQuantity(productInfo.cantidad)) {
      checkStockOn(productInfo)
    } else {
      const error = { text: `Ups! La cantidad a egresar es mayor a la cantidad en almac??n. Cantidad en almac??n: ${productInfo.cantidad}`, background: themeColors?.error }
      throw error;
    }
  }

  class ProductExpense {
    constructor(fk_producto, fk_almacen, product, quantity, units, price, controlNS) {
      this.fk_producto = fk_producto;
      this.fk_almacen = fk_almacen;
      this.product = product;
      this.quantity = Number(quantity);
      this.units = units;
      this.price = Number(price);
      this.controlNS = controlNS;
      this.subTotal = (Number(this.quantity) * Number(this.price)).toFixed(2);
    }
    id = Math.ceil(Math.random() * 10000);
  }

  function addNewProduct(expenseInfo, productObject, quantityToAdd) {
    const newProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_alamcen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio, productObject.controlNS);
    setTotalPrice((prevState) => prevState += Number(newProduct.subTotal))
    setRecordsData([...recordsData, newProduct])
  }

  const addToExpense = () => {
    if (warehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + warehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          validateIfExists(response.data[0])
          validateAdd(response.data[0])
          clearInputs()
          await new Promise(r => setTimeout(r, 500));
          addNewProduct(response.data[0], detailsProduct, detailsQuantity.value)
          setBanner({ ...banner, value: { text: 'Item agregado correctamente!', background: themeColors?.confirm }, error: true })
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
    setTotalPrice((prevState) => prevState -= Number(objectDeleted.subTotal));
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
    const editedProduct = new ProductExpense(expenseInfo.id_producto, expenseInfo.id_alamcen, expenseInfo.nom_producto, quantityToAdd, productObject.abreviatura, expenseInfo.precio, productObject.controlNS);
    const newState = recordsData.map(object => {
      if (Number(object.id) === Number(idSelected)) {
        return editedProduct
      }
      return object
    })

    setTotalPrice((prevState) => prevState += Number(editedProduct.subTotal))
    setRecordsData(newState)
  }

  const updateCartRecord = () => {
    if (warehouse.error === false && detailsProduct.error === false && detailsQuantity.error === false && detailsQuantity.value > 0) {
      getDataByIdFrom(URL_WAREHOUSEPRODUCT + warehouse.id + '/', detailsProduct.id, auth.token)
        .then(async response => {
          const objectToEdit = recordsData.find(object => Number(object.id) === Number(idSelected));
          validateAdd(response.data[0])
          setTotalPrice((prevState) => prevState -= Number(objectToEdit.subTotal));
          if (detailsQuantity.value < objectToEdit.quantity && expenseSerials.find(item => item.fk_producto === detailsProduct.id) && Number(detailsProduct.controlNS) === 1) {
            setBanner({ ...banner, value: { text: `Atenci??n! Nueva cantidad menor a la anterior. Verifique los n??meros de serie.`, background: '#FFC300' }, error: true })
          }
          clearInputs()
          await new Promise(r => setTimeout(r, 500));
          setBanner({ ...banner, value: updateBanner, error: false });
          editProduct(response.data[0], detailsProduct, detailsQuantity.value)
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
      getDataByIdFrom(`${URL_SN}q/productoalmacen/${obj.fk_producto}/${warehouse.id}/`, 0, auth.token)
        .then(response => {
          products.push(response.data);
        })
    ));
    return products;
  }

  async function areSerialsComplete() {
    const serials = await getSerials();
    const totalSerials = serials.flat().map(item => item.sn);
    const fkProducts = serials.flat().map(item => item.id_producto)
    const prods = recordsData.filter(item => fkProducts.includes(item.fk_producto)).reduce((a, b) => a + b.quantity, 0)

    const totalControlProduct = recordsData.filter(record => record.controlNS === 1).length
    const totalProdsWithNS = recordsData.filter(item => fkProducts.includes(item.fk_producto)).length

    let areIncluded = expenseSerials.every(item => totalSerials.includes(item.sn));

    return areIncluded && (prods === expenseSerials.length) && totalControlProduct === totalProdsWithNS
  }


  function generateNewExpense() {
    return { fk_cliente: client.id, fechaegreso: purchaseDate.value, total: totalPrice }
  }

  function generateDetails() {
    const aux = []

    recordsData.forEach(record => {
      aux.push({ fk_producto: record.fk_producto, fk_almacen: warehouse.id, cantidad: record.quantity, precio: record.price, subtotal: record.subTotal })
    })

    return aux
  }

  const generateExpense = async () => {
    if (await areSerialsComplete()) {
      insertNewExpense(generateNewExpense(), generateDetails(), expenseSerials, auth.token)
        .then(() => {
          setBanner({ ...banner, value: createBanner, error: false });
          setClient({ id: '' });
          setWarehouse({ id: '' });
          clearInputs();
          setRecordsData([]);
          setExpenseSerials([])
          setTotalPrice(0);
        })
        .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
    } else {
      setBanner({ ...banner, value: invalidSeries, error: true })
    }
  }

  return (
    <>
      {openSerialNumber === true && <ExpenseSerial warehouse={warehouse.id} product={recordsData.find(object => object.id === productID)} state={expenseSerials} setState={setExpenseSerials} setClose={setOpenSerialNumber} />}
      {openModal.error === false &&
        <Modal
          title='??Est?? seguro que quiere eliminar este registro?'
          text={`El siguiente elemento esta a punto de ser eliminado, ??Desea continuar?`}
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
            {openSearcher === true && <ProductSearcher title={`Productos en ${warehouse.nombre}`} product={detailsProduct} setProduct={setDetailsProduct} warehouse={warehouse.id} setClose={setOpenSearcher} />}
            <div className='w-full flex justify-center pb-4'>
              {edit === true
                ? <Button customFunction={updateCartRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Guardar registro' />
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
          <div className='flex justify-end items-center gap-2 text-2xl'>
            <span className='font-semibold tracking-wide uppercase'>Total:</span>
            <span className='font-[monospace] text-3xl'>$ {totalPrice.toFixed(2)}</span>
          </div>
          <div className='w-full flex justify-center'>
            <Button customFunction={generateExpense} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/4' text='Generar egreso' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Expenses