import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { BsPencil, BsTrash, BsXCircle } from 'react-icons/bs';

import { Button, Input, Modal, Banner, Table } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { regEx, serialNumberGrid } from '../data/dummy';
import { URL_SN } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const SerialNumber = ({ warehouse, product, state, setState, setClose }) => {
    const { themeColors } = useStateContext();
    const refFocus = useRef(null);
    const { auth } = useAuthContext();
    const initialState = { value: '', error: null };
    const createBanner = { text: '¡Series agregadas exitosamente!', background: 'green' }
    const errorBanner = { text: '¡Ups! El número de serie existe o es incorrecto.', background: 'red' }
    const updateBanner = { text: '¡Registro editado exitosamente!', background: 'green' }
    const deleteBanner = { text: 'Serie eliminada del producto exitosamente!', background: 'green' }
    const [recordsData, setRecordsData] = useState([]);
    const [newSerialNumber, setNewSerialNumber] = useState(initialState);
    const [newMac1, setNewMac1] = useState({ value: '', error: false });
    const [newMac2, setNewMac2] = useState({ value: '', error: false });
    const [newMac3, setNewMac3] = useState({ value: '', error: false });
    const [newEn, setNewEn] = useState({ value: '', error: false });
    const [banner, setBanner] = useState(initialState);
    const [openModal, setOpenModal] = useState(initialState);
    const [idSelected, setIdSelected] = useState('');
    const [edit, setEdit] = useState(null);
    const disabled = recordsData.length === Number(product.quantity);
    const inputConfig = [
        { field: 'sn', id: 'serial', useRef: refFocus, label: 'Número de serie (Alfanumérico)', disabled: disabled && !edit, state: newSerialNumber, setState: setNewSerialNumber, expression: 'alphanumeric', css: 'w-1/3' },
        { field: 'mac1', id: 'mac1', label: 'mac1', disabled: disabled && !edit, state: newMac1, setState: setNewMac1, expression: 'alphanumericHyphen', css: 'w-1/3', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
        { field: 'mac2', id: 'mac2', label: 'mac2', disabled: disabled && !edit, state: newMac2, setState: setNewMac2, expression: 'alphanumericHyphen', css: 'w-1/3', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
        { field: 'mac3', id: 'mac3', label: 'mac3', disabled: disabled && !edit, state: newMac3, setState: setNewMac3, expression: 'alphanumericHyphen', css: 'w-1/3', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
        { field: 'en', id: 'en', label: 'en (Alfanumérico)', disabled: disabled && !edit, state: newEn, setState: setNewEn, expression: 'alphanumeric', css: 'w-1/4' },
    ]

    useEffect(() => {
        let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
        return () => { clearTimeout(shadowBanner) };
    });

    useEffect(() => {
        if (state.length !== 0) {
            const serialsPushed = state.filter(object => object.fk_producto === Number(product.id))
            if (serialsPushed !== 0) {
                setRecordsData(serialsPushed);
            }
        }
    }, [state, product.id]);

    const handleClose = () => setClose(false);

    const clearInputs = () => {
        inputConfig.forEach(input => {
            if (input.field)
                input.setState(initialState);
        });
        setNewMac1({ value: '', error: false });
        setNewMac2({ value: '', error: false });
        setNewMac3({ value: '', error: false });
        setNewEn({ value: '', error: false });
        setOpenModal(initialState);
        setIdSelected('');
        setEdit(false);
    }
    const addSerialNumber = async () => {
        const objectSN = {
            id: (Math.ceil(Math.random() * 10000)),
            fk_producto: product.id,
            fk_almacen: warehouse,
            sn: newSerialNumber.value,
            mac1: newMac1.value,
            mac2: newMac2.value,
            mac3: newMac3.value,
            en: newEn.value,
        };
        try {
            let response = await getDataByIdFrom(URL_SN, Number(newSerialNumber.value), auth.token);
            if (response.data === null) {
                if (!!newSerialNumber.value && newSerialNumber.error === false && newMac1.error === false && newMac2.error === false && newMac3.error === false && newEn.error === false) {
                    setRecordsData((prevState) => [...prevState, objectSN]);
                    clearInputs();
                    refFocus.current.focus();
                    if (edit) {
                        deleteDataById()
                    }
                } else {
                    setBanner({ ...banner, value: errorBanner, error: true });
                }
            } else {
                setBanner({ ...banner, value: errorBanner, error: true });
            }
        } catch (error) {
            setBanner({ ...banner, value: errorBanner, error: true })
        }
    }

    const deleteDataById = () => {
        setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
        if (!edit)
            setBanner({ ...banner, value: deleteBanner, error: false });
        clearInputs();
        setOpenModal(initialState);
    }

    const confirmDelete = () => {
        const objectsId = recordsData.map(({ id }) => id);
        if (!!idSelected && objectsId.includes(Number(idSelected)))
            setOpenModal({ ...openModal, value: idSelected, error: false });
    }

    const editInputs = async () => {
        const objectsId = recordsData.map(({ id }) => id);
        let response = recordsData.find(object => object.id === Number(idSelected));
        const fields = inputConfig.map(input => input.field);
        const setStates = inputConfig.map(input => input.setState);
        !Array.isArray(response) && (response = [response])

        if (!!idSelected && objectsId.includes(Number(idSelected)))
            setOpenModal({ ...openModal, value: idSelected });

        setStates.forEach((setState, index) => {
            setState((prevState) => { return { ...prevState, value: response[0][fields[index]], error: false } })
        })
        refFocus.current.focus();
        setEdit(true);
    }

    const updateSerialNumbers = () => {
        addSerialNumber()
        setBanner({ ...banner, value: updateBanner, error: false });
        clearInputs();
    }

    const handleSubmit = () => {
        const values = recordsData.values();
        for (const objects of values) {
            setState((prevState) => [...prevState, objects]);
        }
        setBanner({ ...banner, value: createBanner, error: false });
        setTimeout(() => handleClose(), 1000)
    }

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            {openModal.error === false &&
                <Modal
                    title='¿Está seguro que quiere eliminar este registro?'
                    text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
                    buttonText='Eliminar registro' color='red' icon={<BsXCircle />}
                    setFunction={clearInputs} redirect='' customFunction={deleteDataById}
                />}
            {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white dark:bg-secondary-dark-bg w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <form onSubmit={addSerialNumber} className='w-full flex flex-col justify-center items-center gap-2'>
                        <div className='self-start text-lg'>Números de serie para {product.product}</div>
                        <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
                            {inputConfig.map((input, index) => {
                                const { id, useRef, type, label, disabled, state, setState, expression, helperText, css, tooltip } = input;
                                return (
                                    <TooltipComponent content={tooltip} position="TopCenter">
                                        <span className={css} key={index}>
                                            <Input id={id} useRef={useRef} type={type} label={label} size='small'
                                                required={true} disabled={disabled}
                                                state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
                                        </span>
                                    </TooltipComponent>
                                )
                            })}
                        </div>
                        <div className='w-1/2 flex gap-1'>
                            <Button customFunction={handleClose} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Cerrar' width='1/2' tabindex='-1' />
                            {edit === true ? <Button customFunction={updateSerialNumbers} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/2' text='Editar numero de serie' />
                                : <Button customFunction={addSerialNumber} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Guardar' width='1/2' />}
                        </div>
                    </form>
                    <div className='w-full'>
                        <Table header={serialNumberGrid} data={recordsData} filterTitle='Mis Números de Serie'
                            checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
                    </div>
                    {!!idSelected &&
                        <div className='flex gap-2 justify-end pt-5'>
                            <Button customFunction={clearInputs} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
                            <Button customFunction={editInputs} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Editar registro' icon={<BsPencil />} />
                            <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
                        </div>}
                    <div className='w-1/3 m-auto'>
                        {disabled && !edit && <Button customFunction={handleSubmit} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Agregar números de serie' />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SerialNumber