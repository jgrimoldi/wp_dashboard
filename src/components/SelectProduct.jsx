import React, { useState, useEffect } from 'react'
import { BsSearch } from 'react-icons/bs';

import { Input } from './';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_PRODUCT } from '../services/Api';
import { getDataFrom, getDataByIdFrom } from '../services/GdrService';
import { useStateContext } from '../contexts/ContextProvider';

const ProductSearcher = ({ title, product, setProduct }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const [records, setRecords] = useState([]);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getRecords = async () => {
            await getDataFrom(URL_PRODUCT, signal, auth.token)
                .then(response => setRecords(response.data))
                .catch(error => handleErrors(error))
        }
        getRecords();
        return () => { controller.abort(); };
    }, [auth, handleErrors])

    const filterBy = (object) => {
        for (const key in object) {
            let newObject = object[key];
            if (typeof newObject === 'string' && newObject.includes(filteredValue.value))
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
                    <button key={index} id={`button-${index}`} className='flex justify-between border-b-2 border-slate-900 dark:border-slate-200 last:border-0' value={item.id} onClick={handleClick}>
                        <span value={item.id} onClick={handleClick} title={item.nombre} className='w-1/2 truncate text-left'>
                            <input type='radio' id={`product-${index}`} name='product' onChange={handleClick} value={item.id} checked={item.id === product.id} /> {item.nombre}
                        </span>
                        <span value={item.id} onClick={handleClick} className='w-5/12 text-left'>Stock Máximo: {item.stockmax}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ProductSearcher