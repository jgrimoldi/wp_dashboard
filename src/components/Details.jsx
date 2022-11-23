import React, { useEffect, useState } from 'react';

import { Table, Button } from './';
import { incomeDetailsGrid, serialNumberGrid } from '../data/dummy';
import { URL_INCOME } from '../services/Api';
import { getDataByIdFrom, getDataFrom } from '../services/GdrService';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';

const ButtonToSn = ({ income, product, warehouse, setOpen, setID }) => {
    const { themeColors } = useStateContext()

    const handleOpen = () => {
        setID({ income: income, product: product, warehouse: warehouse })
        setOpen(true)
    }

    return (
        <button type='button' onClick={handleOpen} style={{ backgroundColor: themeColors?.primary }} className='w-40 flex gap-2 items-center justify-center border rounded-xl text-white dark:text-black hover:shadow-lg text-center text-sm whitespace-nowrap'>
            Ver <span className='text-xl'></span>
        </button>
    )
}

const ShowSn = ({ id, setOpen }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const URL = URL_INCOME + 'q/ns/' + id.income + '/' + id.product + '/' + id.warehouse;
        const getSn = async () => {
            await getDataFrom(URL, signal, auth.token)
                .then(response => setRecords(response.data))
                .catch(error => handleErrors(error))
        }
        getSn();
        return () => { controller.abort(); };
    }, [auth, handleErrors, id])

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white w-11/12 dark:bg-secondary-dark-bg sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <div className='dark:text-slate-100'>Numeros de serie</div>
                    <Table header={serialNumberGrid} data={records} filterTitle='Mis Números de Serie' />
                    <div className='flex justify-center items-center'>
                        <Button customFunction={() => { setOpen(false) }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='1/4' text='Cerrar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Details = ({ setOpen, incomeID }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const [detailsData, setDetailsData] = useState([]);
    const [openSN, setOpenSN] = useState(null)
    const [idToSN, setIdToSn] = useState({ income: '', product: '', warehouse: '' })

    useEffect(() => {
        const saveResponse = (data) => {
            if (Array.isArray(data)) {
                setDetailsData(data);
            } else {
                setDetailsData([data])
            }
        }

        const getRecords = async () => {
            await getDataByIdFrom(URL_INCOME + 'q/detallecompra/', incomeID, auth.token)
                .then(response => saveResponse(response.data))
                .catch(error => handleErrors(error))
        }
        getRecords();
    }, [auth, handleErrors, incomeID])

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            {openSN === true && <ShowSn id={idToSN} setOpen={setOpenSN} />}
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white w-11/12 dark:bg-secondary-dark-bg sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <div className='dark:text-slate-100'>Detalle de compra</div>
                    <div>
                        <div className='flex justify-between gap-2 dark:text-slate-100 pb-2 border-b-2 dark:border-b-gray-200 border-b-black'>
                            {incomeDetailsGrid.map((head, index) => <span key={index} className='w-40 text-center text-sm font-semibold tracking-wide' >{head.name}</span>)}
                            <span className='w-40 text-center text-sm font-semibold tracking-wide' >Series</span>
                        </div>
                        {detailsData.map((data, index) => (
                            <div key={index} className='flex justify-between gap-2 pt-2'>
                                {
                                    incomeDetailsGrid.map((grid, index) =>
                                        <div key={index} className='w-40 text-center text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'>
                                            {data[grid.field]}
                                        </div>
                                    )
                                }
                                <ButtonToSn income={incomeID} product={data.id_producto} warehouse={data.id_almacen} setOpen={setOpenSN} setID={setIdToSn} />
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

export default Details