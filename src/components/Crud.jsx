import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { Banner, Title, Table, Input, Button, Modal, Select } from '../components';
import { regEx } from '../data/dummy';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../services/GdrService';
import { useStateContext } from '../contexts/ContextProvider';

const Crud = ({ sufix = 'Mis', title, config, URL, grid, add, update, barcode, setOpen, setProductID }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext();
    const ref = config.find(input => input.useRef && input.useRef !== undefined);
    const initialState = { value: '', error: null };
    const createBanner = { text: '¡Nuevo registro agregado!', background: themeColors?.confirm }
    const updateBanner = { text: '¡Registro editado exitosamente!', background: themeColors?.confirm }
    const deleteBanner = { text: '¡Registro eliminado exitosamente!', background: themeColors?.confirm }
    const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: themeColors?.error }
    const [banner, setBanner] = useState(initialState);
    const [openModal, setOpenModal] = useState(initialState);
    const [recordsData, setRecordsData] = useState([]);
    const [idSelected, setIdSelected] = useState('');
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
        return () => { clearTimeout(shadowBanner) };
    });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getRecords = async () => {
            await getDataFrom(URL, signal, auth.token)
                .then(response => setRecordsData(response.data))
                .catch(error => handleErrors(error))
        }
        getRecords();
        return () => { controller.abort(); };
    }, [auth, handleErrors, URL])

    const clearInputs = () => {
        config.forEach(input => {
            if (input.field)
                input.setState(initialState);
            if (input.getter)
                input.setState({ id: '' });
        });
        setOpenModal(initialState);
        setIdSelected('');
        setEdit(false);
    }

    const addRecord = async () => {
        await add()
            .then(response => {
                setRecordsData(prevState => [...prevState, response.data]);
                setBanner({ ...banner, value: createBanner, error: false });
                clearInputs();
            })
            .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
            .finally(() => ref.useRef.current.focus())
    }

    const confirmDelete = () => {
        const objectsId = recordsData.map(({ id }) => id);
        if (!!idSelected && objectsId.includes(Number(idSelected)))
            setOpenModal({ ...openModal, value: idSelected, error: false });
    }

    const deleteDataById = async () => {
        await deleteDataByIdFrom(URL, openModal.value, auth.token)
            .then(() => {
                setRecordsData(current => current.filter(record => record.id !== Number(openModal.value)));
                setBanner({ ...banner, value: deleteBanner, error: false });
                clearInputs()
            })
            .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
            .finally(() => setOpenModal(initialState))
    }

    const handleInputs = (response) => {
        const fields = config.map(input => input.field);
        const setStates = config.map(input => input.setState);
        const getters = config.map(input => input.getterField).filter(input => input !== undefined);
        const getterStates = config.map(input => input.getter && input.setState).filter(input => input !== undefined)
        !Array.isArray(response) && (response = [response])

        setStates.forEach((setState, index) => {
            setState((prevState) => { return { ...prevState, value: response[0][fields[index]] } })
        })

        getterStates.forEach((setState, index) => {
            setState((prevState) => { return { ...prevState, id: response[0][getters[index]] } })
        })
    }

    const editInputs = async () => {
        await getDataByIdFrom(URL, idSelected, auth.token)
            .then(response => {
                handleInputs(response.data);
                setEdit(true);
            })
            .catch(() => {
                clearInputs();
                setBanner({ ...banner, value: errorBanner, error: false });
            })
            .finally(() => ref.useRef.current.focus())
    }

    const handleEdit = () => {
        const states = config.map(input => input.state);
        const fields = config.map(input => input.field);
        const selected = recordsData.find(record => record.id === Number(idSelected));
        states.forEach((state, index) => {
            selected[fields[index]] = state.value;
        })
    }

    const updateRecord = async () => {
        await update(idSelected)
            .then(() => {
                handleEdit();
                setBanner({ ...banner, value: updateBanner, error: false });
                clearInputs();
            })
            .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
    }

    return (
        <>
            {openModal.error === false &&
                <Modal
                    title='¿Está seguro que quiere eliminar este registro?'
                    text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
                    buttonText='Eliminar registro' color={themeColors?.error} icon={<BsXCircle />}
                    setFunction={clearInputs} redirect='' customFunction={deleteDataById}
                />}
            {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
                <Title category={sufix} title={title} />
                <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
                    {config.map((input, index) => {
                        const { getter, url, field, id, useRef, type, label, disabled, state, setState, expression, helperText, css } = input;
                        return (
                            <span className={css} key={index}>
                                {type === 'checkbox'
                                    ? <label className="inline-flex relative justify-center items-center cursor-pointer">
                                        <input id={id} type='checkbox' value={state.value} onChange={() => setState({ ...state, value: !state.value })} className="sr-only peer" checked={state.value} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-md font-medium text-gray-900 dark:text-gray-300" >{label}</span>
                                    </label>
                                    :
                                    field
                                        ? <Input id={id} useRef={useRef} type={type} label={label} size='small'
                                            required={true} disabled={disabled && edit}
                                            state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
                                        : <Select id={id} label={label} url={url} state={state} setState={setState} disabled={disabled} getter={getter} />
                                }
                            </span>
                        )
                    })}
                    {
                        edit === true
                            ? <Button customFunction={updateRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Editar registro' />
                            : <Button customFunction={addRecord} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full sm:w-1/3' text='Agregar registro' />
                    }
                </div>
                <Table
                    header={grid} data={recordsData} filterTitle={`Mis ${title}`}
                    checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected}
                    barcode={barcode} setOpenBarcode={setOpen} setProductID={setProductID} fieldName='Códigos de Barra'
                />
                {
                    !!idSelected &&
                    <div className='w-full flex sm:justify-end mt-5'>
                        <div className='w-full sm:w-3/5 grid grid-cols-3 gap-1 '>
                            <Button customFunction={clearInputs} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='full' text='Cancelar' />
                            <Button customFunction={editInputs} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full' text='Editar' icon={<BsPencil />} />
                            <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='full' text='Eliminar' icon={<BsTrash />} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Crud