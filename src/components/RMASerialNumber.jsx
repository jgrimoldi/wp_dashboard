import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { BsPencil, BsTrash, BsXCircle, BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';

import { Button, Input, Modal, Banner, Table } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { regEx, serialNumberGrid } from '../data/dummy';
import { URL_SN } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const RMASerialNumber = ({ warehouse, product, state, setState, setClose }) => {
    const { themeColors } = useStateContext();
    const refFocus = useRef(null);
    const { auth } = useAuthContext();
    const initialState = { value: '', error: null };
    const createBanner = { text: '¡Serie agregadas exitosamente!', background: themeColors.confirm }
    const errorBanner = { text: '¡Ups! El número de serie existe o es incorrecto.', background: themeColors.error }
    const invalidSeries = { text: '¡Ups! Las series no estan completas', background: '#FFC300' }
    const updateBanner = { text: '¡Registro editado exitosamente!', background: themeColors.confirm }
    const deleteBanner = { text: 'Serie eliminada del producto exitosamente!', background: themeColors.confirm }
    const [openMacs, setOpenMacs] = useState(false);
    const [newSerialNumber, setNewSerialNumber] = useState(initialState);
    const [newMac1, setNewMac1] = useState({ value: '', error: false });
    const [newMac2, setNewMac2] = useState({ value: '', error: false });
    const [newMac3, setNewMac3] = useState({ value: '', error: false });
    const [newEn, setNewEn] = useState({ value: '', error: false });
    const [banner, setBanner] = useState(initialState);
    const [openModal, setOpenModal] = useState(initialState);
    const [idSelected, setIdSelected] = useState('');
    const [edit, setEdit] = useState(null);
    const completeSeries = state.filter(object => Number(object.fk_producto) === Number(product.id)).length === Number(product.quantity);
    const inputConfig = [
        { field: 'sn', id: 'sn', useRef: refFocus, label: 'Número de serie (Alfanumérico)', disabled: completeSeries && !edit, state: newSerialNumber, setState: setNewSerialNumber, expression: 'alphanumeric', css: 'w-1/2', required: true },
        { field: 'en', id: 'en', label: 'en (Alfanumérico)', disabled: completeSeries && !edit, state: newEn, setState: setNewEn, expression: 'alphanumeric', css: 'w-1/2', required: false },
    ]
    const inputMac = [
        { field: 'mac1', id: 'mac1', label: 'mac1', disabled: completeSeries && !edit, state: newMac1, setState: setNewMac1, expression: 'alphanumericHyphen', css: 'w-full', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
        { field: 'mac2', id: 'mac2', label: 'mac2', disabled: completeSeries && !edit, state: newMac2, setState: setNewMac2, expression: 'alphanumericHyphen', css: 'w-full', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
        { field: 'mac3', id: 'mac3', label: 'mac3', disabled: completeSeries && !edit, state: newMac3, setState: setNewMac3, expression: 'alphanumericHyphen', css: 'w-full', tooltip: 'Formatos: (11:22:33:44:55:66 o 1122.3344.5566 o 1122-3344-5566)' },
    ]

    useEffect(() => {
        let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
        return () => { clearTimeout(shadowBanner) };
    });

    const handleClose = () => {
        if (!completeSeries) {
            setBanner({ ...banner, value: invalidSeries, error: true });
            setTimeout(() => setClose(false), 2000)
        } else {
            setClose(false)
        }
    }

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

    const generateObject = (data) => {
        const formData = new FormData(data);
        formData.append('id', (Math.ceil(Math.random() * 10000)));
        formData.append('fk_producto', product.id);
        formData.append('fk_almacen', warehouse);

        if (!newMac1.value) {
            formData.append('mac1', "");
        }
        if (!newMac2.value) {
            formData.append('mac2', "");
        }
        if (!newMac3.value) {
            formData.append('mac3', "");
        }

        return Object.fromEntries(formData)
    }

    const notExistsInState = (aValue) => {
        return state.filter(object => object.sn === aValue).length === 0
    }

    const addSerialNumber = (event) => {
        event.preventDefault();
        if (!!newSerialNumber.value && notExistsInState(newSerialNumber.value) && newSerialNumber.error === false && newMac1.error === false && newMac2.error === false && newMac3.error === false && newEn.error === false) {
            getDataByIdFrom(URL_SN, newSerialNumber.value, auth.token)
                .then(response => {
                    if (response?.data !== null) {
                        if (response.data.fk_producto !== product.id) {
                            const error = { text: 'Número de serie existente en otro producto!', background: themeColors?.error }
                            throw error;
                        }
                        if (response?.data?.estado === 0) {
                            const error = { text: `El producto se encuentra en stock! No puede realizarse el ingreso del mismo.`, background: themeColors?.error }
                            throw error;
                        }
                        if (response?.data?.estado === 1) {
                            setState((prevState) => [...prevState, generateObject(event.target)]);
                        }
                    }

                    if (response?.data === null) {
                        setState((prevState) => [...prevState, generateObject(event.target)]);
                    }

                    clearInputs();
                    setBanner({ ...banner, value: createBanner, error: false });
                    refFocus.current.focus();
                })
                .catch(error => {
                    if (!!error?.text) {
                        setBanner({ ...banner, value: error, error: true })
                    } else {
                        setBanner({ ...banner, value: { text: 'Ocurrió un problema con el número de serie seleccionado!', background: themeColors?.error }, error: true })
                    }
                })
        } else {
            setBanner({ ...banner, value: errorBanner, error: true });
        }
    }

    const deleteDataById = () => {
        setState((prevState) => prevState.filter(object => Number(object.id) !== Number(idSelected)));
        clearInputs();
        setBanner({ ...banner, value: deleteBanner, error: false });
        setOpenModal(initialState);
    }

    const confirmDelete = () => {
        const objectsId = state.map(({ id }) => id);
        if (!!idSelected && objectsId.includes(idSelected))
            setOpenModal({ ...openModal, value: idSelected, error: false });
    }

    const editInputs = () => {
        const objectToEdit = state.find(object => object.id === idSelected);
        setNewSerialNumber({ value: objectToEdit.sn, error: false })
        setNewMac1({ value: objectToEdit.mac1 === undefined ? '' : objectToEdit.mac1, error: false })
        setNewMac2({ value: objectToEdit.mac2 === undefined ? '' : objectToEdit.mac2, error: false })
        setNewMac3({ value: objectToEdit.mac3 === undefined ? '' : objectToEdit.mac3, error: false })
        setNewEn({ value: objectToEdit.en, error: false })
        refFocus.current.focus();
        setOpenMacs(true);
        setEdit(true);
    }

    const updateSerialNumbers = (event) => {
        event.preventDefault();
        if (!!newSerialNumber.value && notExistsInState(newSerialNumber.value) && newSerialNumber.error === false && newMac1.error === false && newMac2.error === false && newMac3.error === false && newEn.error === false) {
            getDataByIdFrom(URL_SN, newSerialNumber.value, auth.token)
                .then(response => {
                    if (response?.data !== null) {
                        if (response.data.fk_producto !== product.id) {
                            const error = { text: 'Número de serie existente en otro producto!', background: themeColors?.error }
                            throw error;
                        }
                        if (response?.data?.estado === 0) {
                            const error = { text: `El producto se encuentra en stock! No puede realizarse el ingreso del mismo.`, background: themeColors?.error }
                            throw error;
                        }
                        if (response?.data?.estado === 1) {
                            const newState = state.map(object => {
                                if (Number(object.id) === Number(idSelected)) {
                                    setBanner({ ...banner, value: updateBanner, error: false });
                                    return { ...object, sn: newSerialNumber.value, en: newEn.value, mac1: newMac1.value, mac2: newMac2.value, mac3: newMac3.value }
                                }
                                return object
                            })
                            setState(newState)
                        }
                    }

                    if (response?.data === null) {
                        const newState = state.map(object => {
                            if (Number(object.id) === Number(idSelected)) {
                                setBanner({ ...banner, value: updateBanner, error: false });
                                return { ...object, sn: newSerialNumber.value, en: newEn.value, mac1: newMac1.value, mac2: newMac2.value, mac3: newMac3.value }
                            }
                            return object
                        })
                        setState(newState)
                    }

                    clearInputs();
                    setBanner({ ...banner, value: createBanner, error: false });
                    refFocus.current.focus();
                })
                .catch(error => {
                    if (!!error?.text) {
                        setBanner({ ...banner, value: error, error: true })
                    } else {
                        setBanner({ ...banner, value: { text: 'Ocurrió un problema con el número de serie seleccionado!', background: themeColors?.error }, error: true })
                    }
                })
        } else {
            setBanner({ ...banner, value: errorBanner, error: true });
        }
    }

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            {openModal.error === false &&
                <Modal
                    title='¿Está seguro que quiere eliminar este registro?'
                    text={`El número de serie esta a punto de ser eliminado, ¿Desea continuar?`}
                    buttonText='Eliminar registro' color='red' icon={<BsXCircle />}
                    setFunction={clearInputs} redirect='' customFunction={deleteDataById}
                />}
            <div className='mt-24'>
                {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} css='w-full' />}
            </div>
            <div className='h-screen flex items-center justify-center -mt-16'>
                <div className='flex flex-col item gap-5 bg-white dark:bg-secondary-dark-bg w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <form onSubmit={edit ? updateSerialNumbers : addSerialNumber} className='w-full flex flex-col justify-center items-center gap-2'>
                        <div className='self-start text-lg dark:text-slate-100'>Números de serie para {product.product}</div>
                        <div className='w-4/5 flex justify-center gap-5'>
                            {inputConfig.map((input, index) => {
                                const { id, useRef, type, label, disabled, state, setState, expression, helperText, css, required } = input;
                                return (
                                    <span className={css} key={index}>
                                        <Input id={id} useRef={useRef} type={type} label={label} size='small'
                                            required={required} disabled={disabled}
                                            state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
                                    </span>
                                )
                            })}
                        </div>
                        <div className='w-4/5 flex justify-center'>
                            <Button
                                type='button' customFunction={() => setOpenMacs(!openMacs)}
                                color={themeColors?.highEmphasis} borderColor='transparent' text='Agrega MACs' tabindex='-1'
                                icon={openMacs ? <BsArrowUpShort /> : <BsArrowDownShort />}
                            />
                        </div>
                        {openMacs && <div className='w-4/5 grid grid-cols-3 gap-5 pb-5'>
                            {inputMac.map((input, index) => {
                                const { id, useRef, type, label, disabled, state, setState, expression, helperText, css, tooltip } = input;
                                return (
                                    <TooltipComponent key={index} content={tooltip} position="TopCenter">
                                        <span className={css} >
                                            <Input id={id} useRef={useRef} type={type} label={label} size='small'
                                                required={false} disabled={disabled}
                                                state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
                                        </span>
                                    </TooltipComponent>
                                )
                            })}
                        </div>}
                        <div className='w-1/2 flex gap-1'>
                            <Button customFunction={handleClose} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text={state.length > 0 ? 'Guardar y salir' : 'Salir'} width='1/2' tabindex='-1' />
                            {edit === true ? <Button type='submit' borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='1/2' text='Guardar número de serie' />
                                : <Button type='submit' borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Cargar número de serie' width='1/2' />}
                        </div>
                    </form>
                    <div className='w-full max-h-[50vh] overflow-auto'>
                        <Table header={serialNumberGrid} data={state.filter(object => Number(object.fk_producto) === Number(product.id))} filterTitle='Mis Números de Serie'
                            checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
                    </div>
                    {!!idSelected &&
                        <div className='flex gap-2 justify-end pt-5'>
                            <Button customFunction={clearInputs} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
                            <Button customFunction={editInputs} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Editar registro' icon={<BsPencil />} />
                            <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default RMASerialNumber