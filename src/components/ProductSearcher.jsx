import React, { useState, useEffect } from 'react'

import { Input } from './';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_PRODUCT, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const ProductSearcher = ({ title, product, setProduct, warehouse }) => {
    const { auth, handleErrors } = useAuthContext();
    const [records, setRecords] = useState([]);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });

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
    }

    return (
        <div className='absolute left-1/2 border border-slate-900 p-2 bg-white dark:bg-secondary-dark-bg dark:border-white rounded-lg text-slate-900 dark:text-slate-100 z-50'>
            <p className='text-2xl font-extrabold tracking-tight pb-2 border-b-1 border-white '>
                {title}
            </p>
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
        </div>
    )
}

export default ProductSearcher