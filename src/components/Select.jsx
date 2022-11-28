import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../contexts/ContextAuth'
import { useStateContext } from '../contexts/ContextProvider';
import { getDataByIdFrom, getDataFrom } from '../services/GdrService'

const Select = ({ id, label, state, setState, url, disabled, getter }) => {
    const { themeColors } = useStateContext();
    const { auth } = useAuthContext();
    const [data, setData] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getData = async () => {
            await getDataFrom(url, signal, auth.token)
                .then(response => {
                    setData(response.data.filter(info => !!auth.user && auth.user.fk_perfil !== 3 ? info.nom_perfil !== 'dev' : true).sort((info, anotherInfo) => info[getter].localeCompare(anotherInfo[getter])));
                })
                .catch(() => {
                    setData([]);
                })
        }
        getData();
        return () => { controller.abort(); };
    }, [auth, url, getter])

    const setDatosIn = (datos) => {
        if (Array.isArray(datos)) {
            setState(datos[0])
        } else {
            setState(datos)
        }
    }

    const handleChange = (event) => {
        getDataByIdFrom(url, event.target.value, auth.token)
            .then(response => setDatosIn(response.data))
            .catch(error => console.log(error))
    }

    const handleValidation = (event) => {
        if (!event.target.value) {
            setState({ ...state, error: true });
        } else {
            setState({ ...state, error: false });
        }
    }

    const classSelect = `first:text-red-600 w-full p-2 bg-white dark:bg-secondary-dark-bg rounded-md border border-[#c4c4c4] dark:border-[#262626] focus:border-secondary-blue dark:focus:border-secondary-purple hover:border-secondary-blue dark:hover:border-secondary-purple`

    return (
        <select style={{ color: themeColors?.highEmphasis }} className={classSelect}
            id={id} onChange={handleChange}
            onBlur={handleValidation} onKeyUp={handleValidation}
            defaultValue='' value={state.id} disabled={disabled} >
            <option style={{ color: '#c4c4c4' }} value='' disabled>Elija un {label}</option>
            {
                data.map((opcion, index) =>
                    <option key={index} value={opcion.id}>{opcion.nombre}</option>
                )
            }
        </select>
    )
}

export default Select