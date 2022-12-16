import React, { useState, useEffect, useRef } from 'react'

import { Input } from './';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_BARCODE, URL_PRODUCT, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const ProductSearcher = ({ title, product, setProduct, warehouse, setClose }) => {
    const { auth, handleErrors } = useAuthContext();
    const productRef = useRef(null);
    const [records, setRecords] = useState([]);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });

    const [searchBarcode, setSearchBarcode] = useState(false)
    const [filteredBarcode, setFilteredBarcode] = useState({ value: '', error: null });
    const [barcodeResponse, setBarcodeResponse] = useState([]);

    useEffect(() => {
        const clickAwayListener = (event) => {
            if (productRef.current && !productRef.current.contains(event.target)) {
                setClose(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", clickAwayListener);
        return () => { document.removeEventListener("mousedown", clickAwayListener) };
    })

    useEffect(() => {
        getDataByIdFrom(`${URL_WAREHOUSEPRODUCT}/q/poralmacen/`, warehouse, auth.token)
            .then(response => setRecords(response.data))
            .catch(error => handleErrors(error.response))
    }, [auth, handleErrors, warehouse])

    const filterBy = (object) => {
        for (const key in object) {
            let newObject = object[key];
            if (typeof newObject === 'string' && newObject.toLowerCase().includes((filteredValue.value).toLowerCase()))
                return true;
            if (typeof newObject === 'number' && newObject === Number(filteredValue.value))
                return true;

        }
        return false;
    }

    const handleClick = (event) => {
        const id_product = event.target.getAttribute('value');
        getDataByIdFrom(URL_PRODUCT, id_product, auth.token)
            .then(response => setProduct(Object.assign(response.data[0], { error: false })))
            .catch(error => handleErrors(error))
            .finally(() => setClose(false))
    }

    const handleBarcode = async (aBarcode) => {
        if (aBarcode.length > 5) {
            await getDataByIdFrom(URL_BARCODE + 'q/codigodebarra/', aBarcode, auth.token)
                .then(response => setBarcodeResponse(response?.data))
                .catch(() => setBarcodeResponse({}))
        } else {
            setBarcodeResponse({})
        }
    }

    return (
        <div ref={productRef} onKeyDown={(event) => event.key === 'Escape' && setClose(false)} tabIndex='0' className='absolute left-1/2 border border-slate-900 p-2 bg-white dark:bg-secondary-dark-bg dark:border-white rounded-lg text-slate-900 dark:text-slate-100 z-50'>
            <p className='text-2xl font-extrabold tracking-tight pb-2 border-b-1 border-white '>
                {title}
            </p>
            <div className='pt-2'>
                <label className="inline-flex relative justify-center items-center cursor-pointer">
                    <input id='barcode' type='checkbox' value={searchBarcode} onChange={() => setSearchBarcode(!searchBarcode)} className="sr-only peer" checked={searchBarcode} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-md font-medium text-gray-900 dark:text-gray-300" >Buscar por código de barra</span>
                </label>
            </div>
            {searchBarcode ?
                <>
                    <div className='w-full p-2'>
                        <Input id='filter' type='number' label={`Filtrar por código de barra`} size='small'
                            state={filteredBarcode} setState={setFilteredBarcode}
                            customChange={handleBarcode}
                        />
                    </div>
                    <div className='max-w-md h-48 flex flex-col gap-2 overflow-y-auto pt-2 text-lg'>
                        {records.filter(item => item.id_producto === barcodeResponse?.fk_producto).map((item, index) => (
                            <button key={index} id={`button-${index}`} className='w-full flex justify-between border-b-2 border-slate-900 dark:border-slate-200 last:border-0' value={item.id_producto} onClick={handleClick}>
                                <span value={item.id_producto} onClick={handleClick} title={item.nom_producto} className='w-1/2 truncate text-left'>
                                    <input type='radio' id={`product-${index}`} name='product' onChange={handleClick} value={item.id_producto} checked={item.id_producto === product.id} /> {item.nom_producto}
                                </span>
                                <span value={item.id_producto} onClick={handleClick} className='w-1/2 ml-8 text-left'>U. Almacén: {item.cantidad}</span>
                            </button>
                        ))}
                    </div>
                </>
                : <>
                    <div className='w-full p-2'>
                        <Input id='filter' label={`Buscar en mis productos`} size='small'
                            state={filteredValue} setState={setFilteredValue} />
                    </div>
                    <div className='max-w-md h-48 flex flex-col gap-2 overflow-y-auto pt-2 text-lg'>
                        {records.filter(filterBy).map((item, index) => (
                            <button key={index} id={`button-${index}`} className='w-full flex justify-between border-b-2 border-slate-900 dark:border-slate-200 last:border-0' value={item.id_producto} onClick={handleClick}>
                                <span value={item.id_producto} onClick={handleClick} title={item.nom_producto} className='w-1/2 truncate text-left'>
                                    <input type='radio' id={`product-${index}`} name='product' onChange={handleClick} value={item.id_producto} checked={item.id_producto === product.id} /> {item.nom_producto}
                                </span>
                                <span value={item.id_producto} onClick={handleClick} className='w-1/2 ml-8 text-left'>U. Almacén: {item.cantidad}</span>
                            </button>
                        ))}
                    </div>
                </>}
        </div>
    )
}

export default ProductSearcher