import React, { useState } from 'react';

import { SEO, Title, Table, Input, Searcher, Button } from '../components';
import { incomeGrid, regEx } from '../data/dummy';
import { URL_PRODUCT, URL_STORAGE, URL_SUPPLIER } from '../services/Api';
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
  const date = new Date();
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day}`
  const initialState = { value: '', error: null };
  const [recordsData, setRecordsData] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [purchaseDate, setPurchaseDate] = useState({ value: formatedDate, error: false });

  const [detailsProduct, setDetailsProduct] = useState('');
  const [detailsQuantity, setDetailsQuantity] = useState(initialState);
  const [detailsPrice, setDetailsPrice] = useState(initialState);
  const disabled = recordsData.length !== 0;
  const inputPurchase = [
    { getter: 'nombre', url: URL_SUPPLIER, id: 'supplier', label: 'Proveedor', disabled: disabled, state: supplier, setState: setSupplier, expression: 'notEmpty', css: 'w-1/6' },
    { getter: 'nombre', url: URL_STORAGE, id: 'warehouse', label: 'Almacén', disabled: disabled, state: warehouse, setState: setWarehouse, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'date', id: 'date', type: 'date', disabled: disabled, state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/6' },
  ];
  const inputsDetails = [
    { getter: 'nombre', url: URL_PRODUCT, id: 'product', label: 'Producto', state: detailsProduct, setState: setDetailsProduct, expression: 'notEmpty', css: 'w-1/6' },
    { field: 'quantity', id: 'quantity', type: 'number', label: 'Unidades', state: detailsQuantity, setState: setDetailsQuantity, expression: 'digitsRegExp', css: 'w-1/6' },
    { field: 'price', id: 'price', type: 'number', label: 'Precio', state: detailsPrice, setState: setDetailsPrice, expression: 'digitsRegExp', css: 'w-1/6' },
  ]

  const subTotal = (quantity, price) => Number(quantity) * Number(price);

  const addToCart = () => {
    const objectsCart = {
      product: detailsProduct.nombre,
      storage: warehouse.nombre,
      quantity: detailsQuantity.value,
      units: detailsProduct.abreviatura,
      price: detailsPrice.value,
      subTotal: subTotal(detailsQuantity.value, detailsPrice.value),
      alicuota: detailsProduct.alicuota,
    }
    setRecordsData((prevState) => [...prevState, objectsCart]);
  }

  return (
    <>
      <SEO title='Compra de productos' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category='Compra de' title='Productos' />
        <MakeInputs configInputs={inputPurchase} />
        {purchaseDate.error === false && !!supplier && !!warehouse &&
          <>
            <MakeInputs configInputs={inputsDetails} />
            <div className='w-full flex justify-center pb-4'>
              <Button customFunction={addToCart} borderColor='blue' color='white' backgroundColor='blue' width='full sm:w-1/3' text='Agregar registro' />
            </div>
          </>
        }
        <Table header={incomeGrid} data={recordsData} filterTitle='Mis Compras' checkbox={true}/>
      </div>

    </>
  )
}

export default Income

// Para la tabla
// checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected}
// barcode={barcode} setOpenBarcode={setOpen} setProductID={setProductID}