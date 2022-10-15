import React, { useState, useEffect } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { Banner, Title, Table, Input, Button, Modal, Searcher } from '../components';
import { regEx } from '../data/dummy';
import { useAuthContext } from '../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom, getDataByIdFrom } from '../services/GdrService';

const Crud = ({ sufix = 'Mis', title, config, URL, grid, add, update, barcode, setOpen, setProductID }) => {

    const { auth, handleErrors } = useAuthContext();
    const ref = config.find(input => input.useRef && input.useRef !== undefined);
    const initialState = { value: '', error: null };
    const createBanner = { text: '¡Nuevo registro agregado!', background: 'green' }
    const updateBanner = { text: '¡Registro editado exitosamente!', background: 'green' }
    const deleteBanner = { text: '¡Registro eliminado exitosamente!', background: 'green' }
    const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: 'red' }
    const [banner, setBanner] = useState(initialState);
    const [openModal, setOpenModal] = useState(initialState);
    const [recordsData, setRecordsData] = useState([]);
    const [idSelected, setIdSelected] = useState('');
    const [edit, setEdit] = useState(null);

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
            .finally(() => ref[0].current.focus())
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
            })
            .catch(() => setBanner({ ...banner, value: errorBanner, error: true }))
            .finally(() => setOpenModal(initialState))
    }

    const handleInputs = (response) => {
        const fields = config.map(input => input.field);
        const setStates = config.map(input => input.setState);
        !Array.isArray(response) && (response = [response])

        setStates.forEach((setState, index) => {
            setState((prevState) => { return { ...prevState, value: response[0][fields[index]] } })
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
                    buttonText='Eliminar registro' color='red' icon={<BsXCircle />}
                    setFunction={clearInputs} redirect='' customFunction={deleteDataById}
                />}
            {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner(initialState)} />}
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
                <Title category={sufix} title={title} />
                <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
                    {config.map((input, index) => {
                        const { getter, url, field, id, useRef, type, label, disabled, state, setState, expression, helperText, css } = input;
                        return (
                            <span className={css} key={index}>
                                {field
                                    ? <Input id={id} useRef={useRef} type={type} label={label} size='small'
                                        required={true} disabled={disabled && edit}
                                        state={state} setState={setState} regEx={regEx[expression]} helperText={helperText} />
                                    : <Searcher id={id} label={label} url={url} state={state} setState={setState} getter={getter} />}
                            </span>
                        )
                    })}
                    {edit === true
                        ? <Button customFunction={updateRecord} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Editar registro' />
                        : <Button customFunction={addRecord} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar registro' />}
                </div>
                <Table
                    header={grid} data={recordsData} filterTitle={`Mis ${title}`}
                    checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected}
                    barcode={barcode} setOpenBarcode={setOpen} setProductID={setProductID}
                />
                {!!idSelected &&
                    <div className='flex gap-2 justify-end pt-5'>
                        <Button customFunction={clearInputs} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
                        <Button customFunction={editInputs} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Editar registro' icon={<BsPencil />} />
                        <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
                    </div>}
            </div>
        </>
    )
}

export default Crud