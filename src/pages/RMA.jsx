import React, { useState, useEffect } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { BsXCircle, BsTrash, BsPencil, BsSearch } from 'react-icons/bs';

import { SEO, Title, Table, Input, Button, Modal, Banner, SerialNumber, Select, ProductSearcher } from '../components';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { incomeGrid, regEx } from '../data/dummy';
import { URL_PRODUCT, URL_STORAGE, URL_SUPPLIER, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';
import { insertRMA } from '../services/MovsService';

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

const RMA = () => {
    const { themeColors } = useStateContext();
    const { auth } = useAuthContext();
    const date = new Date();
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
    const formatedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    const initialState = { value: '', error: null };
    const createBanner = { text: 'Devolución realizada exitosamente!', background: themeColors?.confirm }
    const invalidSeries = { text: '¡Ups! Las series no estan completas', background: '#FFC300' }
    const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
    const updateBanner = { text: 'Item editado exitosamente!', background: themeColors?.confirm }
    const deleteBanner = { text: 'Item eliminado exitosamente!', background: themeColors?.confirm }
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
    const [openSearcher, setOpenSearcher] = useState(false);
    const inputPurchase = [
        { getter: 'nombre', url: URL_SUPPLIER, id: 'supplier', label: 'Proveedor', state: supplier, setState: setSupplier, expression: 'notEmpty', css: 'w-1/6' },
        { getter: 'nombre', url: URL_STORAGE, id: 'warehouse', label: 'Almacén', state: warehouse, setState: setWarehouse, expression: 'notEmpty', css: 'w-1/6', disabled: recordsData.length > 0, },
        { field: 'date', id: 'date', type: 'date', state: purchaseDate, setState: setPurchaseDate, expression: 'notEmpty', css: 'w-1/6' },
    ];
    const inputsDetails = [
        { getter: 'nombre', url: URL_PRODUCT, id: 'product', label: 'Producto', state: detailsProduct, setState: setDetailsProduct, expression: 'notEmpty', css: 'w-1/3', tooltip: 'Abrir buscador', customFunction: () => setOpenSearcher(!openSearcher) },
        { field: 'quantity', id: 'quantity', type: 'number', label: 'Unidades', state: detailsQuantity, setState: setDetailsQuantity, expression: 'digitsRegExp', css: 'w-1/12' },
        { field: 'unitPrice', id: 'price', type: 'number', label: 'Precio', state: detailsPrice, setState: setDetailsPrice, expression: 'digitsRegExp', css: 'w-1/12' },
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
        setDetailsProduct({ id: '' });
        setOpenModal(initialState);
        setIdSelected('');
        setEdit(false);
        setOpenSearcher(false)
    }

    const calculatePrice = (quantity, price) => Number(quantity) * Number(price);
    const calculateSubTotal = (IVA, price) => (Number(IVA) + Number(price)).toFixed(2);
    const calculateIVA = (price, alicuota) => (Number(price) * (Number(alicuota) / 100)).toFixed(2);

    function checkStockOn(aProduct) {
        if (aProduct.id === detailsProduct.id) {
            getDataByIdFrom(URL_WAREHOUSEPRODUCT + warehouse.id + '/', aProduct.id, auth.token)
                .then(response => {
                    const quantityOnWarehouse = response.data.length !== 0 ? response.data[0].cantidad : 0
                    const quantityOnProduct = Number(quantityOnWarehouse) + Number(detailsQuantity.value);
                    const stockMax = detailsProduct.stockmax <= quantityOnProduct;

                    if (stockMax) {
                        setBanner({ ...banner, value: { text: `Atención! Producto por encima del stock. Stock máximo: ${detailsProduct.stockmax}. Unidades en el almacén: ${quantityOnProduct}`, background: '#FFC300' }, error: false })
                    }
                })
                .catch(() => {
                    const error = { text: `Ups! Ocurrió un problema`, background: themeColors?.error }
                    throw error;
                })
        } else {
            const error = { text: `Ups! Ocurrió un error al seleccionar el producto`, background: themeColors?.error }
            throw error;
        }
    }

    function validateIfExists(product) {
        const datos = recordsData.map(item => item.id);
        return datos.includes(product.id)
    }

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
        if (!!detailsProduct && detailsQuantity.error === false && detailsPrice.error === false && Number(detailsQuantity.value) > 0 && !validateIfExists(detailsProduct)) {
            setSubTotalPrice((prevState) => prevState += Number(objectsCart.price));
            setTotalVATPrice((prevState) => prevState += Number(objectsCart.VAT));
            setTotalPrice((prevState) => prevState += Number(objectsCart.subTotal));
            setRecordsData((prevState) => [...prevState, objectsCart]);
            checkStockOn(objectsCart)
            clearInputs();
        } else {
            setBanner({ ...banner, value: errorBanner, error: true });
        }
    }

    const deleteDataById = () => {
        const objectDeleted = recordsData.find(object => object.id === Number(openModal.value));
        setSubTotalPrice((prevState) => prevState -= Number(objectDeleted.price));
        setTotalVATPrice((prevState) => prevState -= Number(objectDeleted.VAT));
        setTotalPrice((prevState) => prevState -= Number(objectDeleted.subTotal));
        setIncomeSerialNumbers(current => current.filter(record => record.fk_producto !== Number(openModal.value)));
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
        await getDataByIdFrom(URL_PRODUCT, objectToEdit.id, auth.token)
            .then(res => setDetailsProduct(res.data[0]))

        setDetailsQuantity({ value: objectToEdit.quantity, error: false })
        setDetailsPrice({ value: objectToEdit.unitPrice, error: false })
        setEdit(true);
    }

    const updateCartRecord = () => {
        const objectToEdit = recordsData.find(object => Number(object.id) === Number(idSelected));

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

        const newState = recordsData.map(object => {
            if (Number(object.id) === Number(idSelected)) {
                setBanner({ ...banner, value: updateBanner, error: false });
                return objectsCart
            }
            return object
        })

        if (!!detailsProduct && detailsQuantity.error === false && detailsPrice.error === false && Number(detailsQuantity.value) > 0) {
            setSubTotalPrice((prevState) => prevState -= Number(objectToEdit.price));
            setTotalVATPrice((prevState) => prevState -= Number(objectToEdit.VAT));
            setTotalPrice((prevState) => prevState -= Number(objectToEdit.subTotal));
            setSubTotalPrice((prevState) => prevState += Number(objectsCart.price));
            setTotalVATPrice((prevState) => prevState += Number(objectsCart.VAT));
            setTotalPrice((prevState) => prevState += Number(objectsCart.subTotal));
            setRecordsData(newState)
            setBanner({ ...banner, value: updateBanner, error: false });
            clearInputs();
        } else {
            setBanner({ ...banner, value: errorBanner, error: true });
        }
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

    const GenerateSerials = () => {
        const aux = [];

        incomeSerialNumbers.forEach(object => {
            aux.push({ fk_producto: object.fk_producto, sn: object.sn, en: object.en, mac1: object.mac1, mac2: object.mac2, mac3: object.mac3 })
        })

        return aux
    }

    const areSerialsComplete = (aSerials) => {
        const idFromSerials = new Set(aSerials.map(serial => serial.fk_producto))
        const productsWithSerials = recordsData.filter(record => idFromSerials.has(String(record.id)))
        const lengthOfSerials = aSerials.length
        const lengthOfProductsWithSeries = productsWithSerials.map(product => Number(product.quantity)).reduce((a, b) => a + b, 0)

        return lengthOfProductsWithSeries === lengthOfSerials
    }


    const generateIncome = async () => {
        if (areSerialsComplete(incomeSerialNumbers)) {
            await insertRMA(generatePurchase(), generateDetails(), GenerateSerials(), auth.token)
                .then(() => {
                    setBanner({ ...banner, value: createBanner, error: false });
                    setSupplier({ id: '' });
                    setWarehouse({ id: '' });
                    clearInputs();
                    setRecordsData([]);
                    setIncomeSerialNumbers([])
                    setSubTotalPrice(0);
                    setTotalVATPrice(0);
                    setTotalPrice(0);
                })
                .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
        } else {
            setBanner({ ...banner, value: invalidSeries, error: true })
        }
    }

    return (
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
            <SEO title='Devolución RMA' />
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
                <Title category='Devolución de' title='Productos' />
                <MakeInputs configInputs={inputPurchase} />
                {purchaseDate.error === false && !!supplier.nombre && !!warehouse.nombre &&
                    <>
                        <MakeInputs configInputs={inputsDetails} />
                        {openSearcher === true && <ProductSearcher title={`Productos en ${warehouse.nombre}`} product={detailsProduct} setProduct={setDetailsProduct} warehouse={warehouse.id} setClose={setOpenSearcher} />}
                        <div className='w-full flex justify-center pb-4'>
                            {edit === true
                                ? <Button customFunction={updateCartRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Editar registro' />
                                : <Button customFunction={addToCart} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Agregar registro' />}
                        </div>
                    </>
                }
                <Table
                    header={incomeGrid} data={recordsData} filterTitle='Mis Items'
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
                        <Button customFunction={generateIncome} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/4' text='Generar devolución' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RMA
