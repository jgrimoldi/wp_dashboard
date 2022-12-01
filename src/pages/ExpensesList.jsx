import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash } from 'react-icons/bs';

import { Details, SEO, Table, Title, Button, Modal, Banner } from '../components';
import { expenseListGrid } from '../data/dummy';
import { URL_EXPENSES, URL_INCOME } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../services/GdrService';
import { useStateContext } from '../contexts/ContextProvider';

const IncomeList = () => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
    const permissionsBanner = { text: '¡Ups! No tienes los permisos necesarios.', background: themeColors?.error }
    const deleteBanner = { text: 'Egreso eliminado exitosamente!', background: themeColors?.confirm }
    const [recordsData, setRecordsData] = useState([])
    const [openDetails, setOpenDetails] = useState(null);
    const [expenseId, setExpenseId] = useState('');
    const [expenseCheck, setExpenseCheck] = useState('');
    const [openModal, setOpenModal] = useState({ value: '', error: null });
    const [banner, setBanner] = useState({ value: '', error: null });
    const sortByLastCreated = (data, anotherData) => new Date(anotherData.createdAt) < new Date(data.createdAt) ? -1 : 1

    // console.log(recordsData)

    useEffect(() => {
        let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
        return () => { clearTimeout(shadowBanner) };
    });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getIncomes = async () => {
            await getDataFrom(URL_EXPENSES, signal, auth.token)
                .then(response => setRecordsData(response.data))
                .catch(error => handleErrors(error))
        }
        getIncomes();
        return () => { controller.abort(); };
    }, [auth, handleErrors])

    const clearInputs = () => {
        setExpenseCheck('')
        setOpenModal({ value: '', error: null });
    }

    const confirmDelete = () => {
        const objectsId = recordsData.map(({ id }) => id);
        if (!!expenseCheck && objectsId.includes(Number(expenseCheck)))
            setOpenModal({ ...openModal, value: expenseCheck, error: false });
    }

    const deleteDataById = () => {
        setOpenModal({ value: '', error: null });
        deleteDataByIdFrom(URL_INCOME, openModal.value, auth.token)
            .then(() => {
                setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
                setBanner({ ...banner, value: deleteBanner, error: false })
            })
            .catch((error) => {
                if (error.response.data.error === 'USER_NOT_PERMISSIONS') {
                    setBanner({ ...banner, value: permissionsBanner, error: true })
                } else {
                    setBanner({ ...banner, value: errorBanner, error: true })
                }
            })
            .finally(() => clearInputs())
    }

    return (
        <>
            <SEO title='Lista de egresos' />
            {openDetails === true && <Details URL={URL_EXPENSES} setOpen={setOpenDetails} incomeID={expenseId} />}
            {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner({ value: '', error: null })} />}
            {openModal.error === false &&
                <Modal
                    title='¿Está seguro que quiere eliminar este registro?'
                    text={`El siguiente elemento esta a punto de ser eliminado, ¿Desea continuar?`}
                    buttonText='Eliminar registro' color={themeColors?.error} icon={<BsXCircle />}
                    setFunction={clearInputs} redirect='' customFunction={deleteDataById}
                />}
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
                <Title category="Lista de" title="Egresos" />
                <Table
                    header={expenseListGrid} data={recordsData} filterTitle='Mis egresos'
                    sortFunction={sortByLastCreated} checkbox={true} stateCheckbox={expenseCheck} setStateCheckbox={setExpenseCheck}
                    barcode={true} setOpenBarcode={setOpenDetails} fieldName='Ver detalles' setProductID={setExpenseId}
                />
                {!!expenseCheck &&
                    <div className='w-full flex sm:justify-end mt-5'>
                        <div className='w-full sm:w-2/5 grid grid-cols-2 gap-1 '>
                            <Button customFunction={clearInputs} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='full' text='Cancelar' />
                            <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full' text='Eliminar' icon={<BsTrash />} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default IncomeList