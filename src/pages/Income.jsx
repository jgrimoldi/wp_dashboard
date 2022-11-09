import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Title, Table, Input, Searcher, Button, Modal, Banner, SerialNumber } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { incomeGrid, regEx } from '../data/dummy';
import { URL_PRODUCT, URL_STORAGE, URL_SUPPLIER } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';
import { insertNewIncome } from '../services/MovsService';

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
            : <Searcher id={id} label={label} url={url} state={state} setState={setState} getter={getter} disabled={disabled} />}
        </span>
      )
    })}
  </div>
)

const Income = () => {
  const { themeColors } = useStateContext();
  const { auth } = useAuthContext();
  const date = new Date();
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  const initialState = { value: '', error: null };
  const createBanner = { text: '¡Compra registrada exitosamente!', background: themeColors?.confirm }
  const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
  const updateBanner = { text: '¡Registro editado exitosamente!', background: themeColors?.confirm }
  const deleteBanner = { text: 'Producto eliminado de la compra exitosamente!', background: themeColors?.confirm }
  const [recordsData, setRecordsData] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [purchaseDate, setPurchaseDate] = useState({ value: formatedDate, error: false });
  const [detailsProduct, setDetailsProduct] = useState('');
  const [detailsQuantity, setDetailsQuantity] = useState(initialState);
  const [detailsPrice, setDetailsPrice] = useState(initialState);
  const [incomeSerialNumbers, setIncomeSerialNumbers] = useState([]);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalVATPrice, setTotalVATPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productID, setProductID] = useState('');
  const [openSerialNumber, setOpenSerialNumber] = useState(null);
  const [banner, setBanner] = useState(initialState);
  const [openModal, setOpenModal] = useState(initialState);
  const [idSelected, setIdSelected] = useState('');
  const [edit, setEdit] = useState(null);
  const inputPurchase = [
    { getter: 'nombre', url: URL_SUPPLIER, id: 'supplier', label: 'Proveedor', state: supplier, setState: setSupplier, expression: 'notEmpty', css: 'w-1/6' },
    { getter: 'nombre', url: URL_STORAGE, id: 'warehouse', label: 'Almacén', state: warehouse, setState: setWarehouse, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'date', id: 'date', type: 'date', state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/6' },
  ];
  const inputsDetails = [
    { getter: 'nombre', url: URL_PRODUCT, id: 'product', label: 'Producto', state: detailsProduct, setState: setDetailsProduct, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'quantity', id: 'quantity', type: 'number', label: 'Unidades', state: detailsQuantity, setState: setDetailsQuantity, expression: 'digitsRegExp', css: 'w-1/6' },
    { field: 'unitPrice', id: 'price', type: 'number', label: 'Precio', state: detailsPrice, setState: setDetailsPrice, expression: 'digitsRegExp', css: 'w-1/6' },
  ]

  useEffect(() => {
    let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
    return () => { clearTimeout(shadowBanner) };
  });

  const clearInputs = () => {
    inputsDetails.forEach(input => {
      if (input.field)
        input.setState(initialState);
    });
    setOpenModal(initialState);
    setIdSelected('');
    setEdit(false);
  }

  const calculatePrice = (quantity, price) => Number(quantity) * Number(price);
  const calculateSubTotal = (IVA, price) => (Number(IVA) + Number(price)).toFixed(2);
  const calculateIVA = (price, alicuota) => (Number(price) * (Number(alicuota) / 100)).toFixed(2);

  const addToCart = () => {
    const objectsCart = new function () {
      this.id = detailsProduct.id;
      this.product = detailsProduct.nombre;
      this.quantity = detailsQuantity.value;
      this.units = detailsProduct.abreviatura;
      this.unitPrice = detailsPrice.value;
      this.price = calculatePrice(detailsQuantity.value, detailsPrice.value);
      this.alicuota = detailsProduct.alicuota;
      this.VAT = calculateIVA(this.price, detailsProduct.alicuota);
      this.subTotal = calculateSubTotal(this.VAT, this.price);
    };
    if (!!detailsProduct && detailsQuantity.error === false && detailsPrice.error === false) {
      setSubTotalPrice((prevState) => prevState += Number(objectsCart.price));
      setTotalVATPrice((prevState) => prevState += Number(objectsCart.VAT));
      setTotalPrice((prevState) => prevState += Number(objectsCart.subTotal));
      setRecordsData((prevState) => [...prevState, objectsCart]);
      clearInputs();
      if (edit)
        deleteDataById();
    } else {
      setBanner({ ...banner, value: errorBanner, error: true });
    }
  }

  const deleteDataById = () => {
    const objectDeleted = recordsData.find(object => object.id === Number(openModal.value));
    setSubTotalPrice((prevState) => prevState -= Number(objectDeleted.price));
    setTotalVATPrice((prevState) => prevState -= Number(objectDeleted.VAT));
    setTotalPrice((prevState) => prevState -= Number(objectDeleted.subTotal));
    setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
    setOpenModal(initialState);
    if (!edit)
      setBanner({ ...banner, value: deleteBanner, error: false });
  }

  const confirmDelete = () => {
    const objectsId = recordsData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, error: false });
  }

  const editInputs = async () => {
    const objectsId = recordsData.map(({ id }) => id);
    let response = recordsData.find(object => object.id === Number(idSelected));
    const fields = inputsDetails.map(input => input.field);
    const setStates = inputsDetails.map(input => input.setState);
    !Array.isArray(response) && (response = [response])

    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected });

    await getDataByIdFrom(URL_PRODUCT, response[0].id, auth.token)
      .then(res => setDetailsProduct(res.data[0]))

    setStates.forEach((setState, index) => {
      setState((prevState) => { return { ...prevState, value: response[0][fields[index]] } })
    })
    setEdit(true);
  }

  const updateCartRecord = () => {
    addToCart();
    setBanner({ ...banner, value: updateBanner, error: false });
    clearInputs();
  }

  const generatePurchase = () => {
    if (!!supplier && purchaseDate.error === false && !!subTotalPrice && !!totalVATPrice && !!totalPrice) {
      return {
        fk_proveedor: supplier.id,
        fechacompra: purchaseDate.value,
        subtotal: subTotalPrice.toFixed(2),
        totaliva: totalVATPrice.toFixed(2),
        total: totalPrice.toFixed(2),
      }
    }
  }

  const generateDetails = () => {
    const array = [];
    recordsData.forEach(data => {
      const object = {
        fk_producto: data.id,
        fk_almacen: warehouse.id,
        cantidad: data.quantity,
        precio: Number(data.unitPrice).toFixed(2),
        subtotal: Number(data.price).toFixed(2),
        importeiva: Number(data.VAT).toFixed(2),
      }
      array.push(object);
    })
    return array;
  }

  const generateSerials = () => {
    incomeSerialNumbers.forEach(object => {
      delete object.id
    })
  }

  const generateIncome = async () => {
    generateSerials();

    await insertNewIncome(generatePurchase(), generateDetails(), incomeSerialNumbers, auth.token)
      .then(() => {
        setBanner({ ...banner, value: createBanner, error: false });
        clearInputs();
        setRecordsData([]);
        setSubTotalPrice(0);
        setTotalVATPrice(0);
        setTotalPrice(0);
      })
      .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
  }

  return (
    <>
      {openSerialNumber === true && <SerialNumber warehouse={warehouse.id} product={recordsData.find(object => object.id === productID)} state={incomeSerialNumbers} setState={setIncomeSerialNumbers} setClose={setOpenSerialNumber} />}
      {openModal.error === false &&
        <Modal
          title='¿Está seguro que quiere eliminar este registro?'
          text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          buttonText='Eliminar registro' color={themeColors?.error} icon={<BsXCircle />}
          setFunction={clearInputs} redirect='' customFunction={deleteDataById}
        />}
      {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
      <SEO title='Compra de productos' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category='Compra de' title='Productos' />
        <MakeInputs configInputs={inputPurchase} />
        {purchaseDate.error === false && !!supplier.nombre && !!warehouse.nombre &&
          <>
            <MakeInputs configInputs={inputsDetails} />
            <div className='w-full flex justify-center pb-4'>
              {edit === true
                ? <Button customFunction={updateCartRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Editar registro' />
                : <Button customFunction={addToCart} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Agregar registro' />}
            </div>
          </>
        }
        <Table
          header={incomeGrid} data={recordsData} filterTitle='Mis Compras'
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
          </div>
          <div className='w-full flex justify-center'>
            <Button customFunction={generateIncome} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/4' text='Generar compra' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Income

// Para la tabla
