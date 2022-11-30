import React, { useState } from 'react'
import { useEffect } from 'react';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_PRODUCT, URL_WAREHOUSEPRODUCT } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const ProductSearcher = ({ title, product, setProduct, warehouse }) => {
    const { auth, handleErrors } = useAuthContext();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        getDataByIdFrom(`${URL_WAREHOUSEPRODUCT}/q/poralmacen/`, warehouse, auth.token)
            .then(response => setRecords(response.data))
            .catch(error => handleErrors(error.response))
    }, [auth, handleErrors, warehouse])

    const handleClick = (event) => {
        const id_product = event.target.getAttribute('value');
        getDataByIdFrom(URL_PRODUCT, id_product, auth.token)
            .then(response => setProduct(response.data[0]))
            .catch(error => handleErrors(error))
    }

    return (
        <div className='absolute left-1/2 border border-slate-900 p-2 bg-white dark:bg-secondary-dark-bg dark:border-white rounded-lg text-slate-900 dark:text-slate-100 z-50'>
            <p className='text-2xl font-extrabold tracking-tight pb-2 border-b-1 border-white '>
                {title}
            </p>
            <div className='flex flex-col gap-2 overflow-y-auto pt-2 text-lg'>
                {records.map((item, index) => (
                    <button key={index} id={`button-${index}`} className='flex justify-between' value={item.id_producto} onClick={handleClick}>
                        <span value={item.id_producto} onClick={handleClick}>
                            <input type='radio' id={`product-${index}`} name='product' onChange={handleClick} value={item.id_producto} checked={item.id_producto === product.id} /> {item.nom_producto}
                        </span>
                        <span value={item.id_producto} onClick={handleClick}>U. Almacén: {item.cantidad}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ProductSearcher