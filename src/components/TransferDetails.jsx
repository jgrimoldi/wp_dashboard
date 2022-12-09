import React, { useEffect, useState } from 'react';

import {  Button } from './';
import { transferDetailsGrid } from '../data/dummy';
import { getDataByIdFrom } from '../services/GdrService';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';

const TransferDetails = ({ URL, setOpen, incomeID }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const [detailsData, setDetailsData] = useState([]);
    const fullURL = `${URL}q/detallemovimiento/`

    useEffect(() => {
        const saveResponse = (data) => {
            if (Array.isArray(data)) {
                setDetailsData(data);
            } else {
                setDetailsData([data])
            }
        }

        const getRecords = async () => {
            await getDataByIdFrom(fullURL, incomeID, auth.token)
                .then(response => saveResponse(response.data))
                .catch(error => handleErrors(error))
        }
        getRecords();
    }, [auth, handleErrors, incomeID, fullURL])

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white w-11/12 dark:bg-secondary-dark-bg sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <div className='dark:text-slate-100'>Detalle de compra</div>
                    <div>
                        <div className='flex justify-between gap-2 dark:text-slate-100 pb-2 border-b-2 dark:border-b-gray-200 border-b-black'>
                            {transferDetailsGrid.map((head, index) => <span key={index} className='w-40 text-center text-sm font-semibold tracking-wide' >{head.name}</span>)}
                        </div>
                        {detailsData.map((data, index) => (
                            <div key={index} className='flex justify-between gap-2 pt-2'>
                                {
                                    transferDetailsGrid.map((grid, index) =>
                                        <div key={index} className='w-40 text-center text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'>
                                            {data[grid.field]}
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center items-center'>
                        <Button customFunction={() => { setOpen(false) }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='1/4' text='Cerrar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransferDetails