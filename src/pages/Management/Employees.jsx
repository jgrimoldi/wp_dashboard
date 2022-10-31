import React, { useEffect, useRef, useState } from 'react';
import { BsXCircle, BsTrash, BsPencil } from 'react-icons/bs';

import { SEO, Title, Table, Button, Searcher, Modal, Input, Banner } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { employeesGrid, regEx } from '../../data/dummy';
import { URL_AUTH, URL_COMPANY, URL_PROFILE } from '../../services/Api';
import { updateUserById } from '../../services/AuthService';
import { getDataFrom, deleteDataByIdFrom, getDataByIdFrom } from '../../services/GdrService';

const Employees = () => {
    const { auth, handleErrors } = useAuthContext()
    const editFocus = useRef(null);
    const initialState = { value: '', error: null };
    const updateBanner = { text: '¡Registro editado exitosamente!', background: 'green' }
    const deleteBanner = { text: '¡Registro eliminado exitosamente!', background: 'green' }
    const errorBanner = { text: '¡Ups! No se pudo realizar la acción.', background: 'red' }
    const [employeesData, setEmployeesData] = useState([]);
    const [banner, setBanner] = useState(initialState);
    const [openModal, setOpenModal] = useState(initialState);
    const [idSelected, setIdSelected] = useState('');
    const [edit, setEdit] = useState(null);
    const [newEmail, setNewEmail] = useState(initialState);
    const [newName, setNewName] = useState(initialState);
    const [newSurname, setNewSurname] = useState(initialState);
    const [newProfile, setNewProfile] = useState('');
    const [newCompany, setNewCompany] = useState('');
    const config = [
        { field: 'email', id: 'email', label: 'Correo', disabled: true, state: newEmail, setState: setNewEmail, css: 'w-5/6 sm:w-1/6' },
        { field: 'nombre', id: 'name', useRef: editFocus, label: 'Cambiar nombre', state: newName, setState: setNewName, expression: 'notEmpty', css: 'w-5/6 sm:w-1/6' },
        { field: 'apellido', id: 'surname', label: 'Cambiar apellido', state: newSurname, setState: setNewSurname, expression: 'notEmpty', css: 'w-5/6 sm:w-1/6' },
        { getter: 'nom_perfil', url: URL_PROFILE, id: 'type', label: 'Perfil', state: newProfile, setState: setNewProfile, expression: 'notEmpty', css: 'w-5/6 sm:w-1/6' },
        { getter: 'razonsocial', url: URL_COMPANY, id: 'unit', label: 'Empresa', state: newCompany, setState: setNewCompany, expression: 'notEmpty', css: 'w-5/6 sm:w-1/6' },
    ];

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getEmployees = async () => {
            await getDataFrom(URL_AUTH, signal, auth.token)
                .then(response => setEmployeesData(response.data))
                .catch(error => handleErrors(error))
        }
        getEmployees();
        return () => { controller.abort(); };
    }, [auth, handleErrors])

    const clearInputs = () => {
        config.forEach(input => {
            if (input.field)
                input.setState(initialState);
        });
        setOpenModal(initialState);
        setIdSelected('');
        setEdit(false);
    }

    const confirmDelete = () => {
        const objectsId = employeesData.map(({ id }) => id);
        if (!!idSelected && objectsId.includes(Number(idSelected)))
            setOpenModal({ ...openModal, value: idSelected, error: false });
    }

    const deleteDataById = async () => {
        await deleteDataByIdFrom(URL_AUTH, openModal.value, auth.token)
            .then(() => {
                setEmployeesData(current => current.filter(record => record.id !== Number(openModal.value)));
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
        await getDataByIdFrom(URL_AUTH, Number(idSelected), auth.token)
            .then(response => {
                handleInputs(response.data);
                setEdit(true);
            })
            .catch(() => {
                clearInputs();
                setBanner({ ...banner, value: errorBanner, error: false });
            })
            .finally(() => editFocus.current.focus())
    }

    const handleEdit = () => {
        const states = config.map(input => input.state);
        const fields = config.map(input => input.field);
        const selected = employeesData.find(record => record.id === Number(idSelected));
        states.forEach((state, index) => {
            selected[fields[index]] = state.value;
        })
    }

    const updateRecord = async () => {
        await updateUserById(Number(idSelected), newEmail.value, newName.value, newSurname.value, newProfile.id, newCompany.id, 1, auth.token)
            .then(() => {
                handleEdit();
                setBanner({ ...banner, value: updateBanner, error: false });
                clearInputs();
            })
            .catch(error => {
                console.log(error.response);
                setBanner({ ...banner, value: errorBanner, error: true })
            })
    }
    const sortByLastCreated = (data, anotherData) => new Date(anotherData.createdAt) < new Date(data.createdAt) ? -1 : 1

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
            <SEO title='Usuarios' />
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
                <Title category="Mis" title="Usuarios" />
                <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
                    {edit === true && config.map((input, index) => {
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
                    {edit === true && <Button customFunction={updateRecord} borderColor='blue' color='white' backgroundColor='blue' width='full sm:w-1/3' text='Editar registro' />}
                </div>
                <Table
                    header={employeesGrid} data={employeesData.filter(user => user.id !== auth.user.id && user.fk_perfil !== 3)}
                    filterTitle='Mis Usuarios' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} sortFunction={sortByLastCreated}
                />
                {!!idSelected &&
                    <div className='w-full flex sm:justify-end mt-5'>
                        <div className='w-full sm:w-3/5 grid grid-cols-3 gap-1 '>
                            <Button customFunction={clearInputs} borderColor='black' color='black' backgroundColor='transparent' width='full' text='Cancelar' />
                            <Button customFunction={editInputs} borderColor='blue' color='white' backgroundColor='blue' width='full' text='Editar' icon={<BsPencil />} />
                            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='full' text='Eliminar' icon={<BsTrash />} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Employees