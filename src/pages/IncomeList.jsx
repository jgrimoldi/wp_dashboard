import React, { useState, useEffect } from 'react';

import { Details, SEO, Table, Title } from '../components';
import { incomeListGrid } from '../data/dummy';
import { URL_INCOME } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const IncomeList = () => {
    const { auth, handleErrors } = useAuthContext();
    const [recordsData, setRecordsData] = useState([])
    const [openDetails, setOpenDetails] = useState(null);
    const [incomeID, setIncomeId] = useState('');
    const sortByLastCreated = (data, anotherData) => new Date(anotherData.createdAt) < new Date(data.createdAt) ? -1 : 1

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getIncomes = async () => {
            await getDataFrom(URL_INCOME, signal, auth.token)
                .then(response => setRecordsData(response.data))
                .catch(error => handleErrors(error))
        }
        getIncomes();
        return () => { controller.abort(); };
    }, [auth, handleErrors])
    
    return (
        <>
            <SEO title='Lista de ingresos' />
            {openDetails === true && <Details setOpen={setOpenDetails} incomeID={incomeID} />}
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
                <Title category="Lista de" title="Compras" />
                <Table header={incomeListGrid} data={recordsData} filterTitle='Mis compras' sortFunction={sortByLastCreated} barcode={true} setOpenBarcode={setOpenDetails} fieldName='Ver detalles' setProductID={setIncomeId} />
            </div>
        </>
    )
}

export default IncomeList