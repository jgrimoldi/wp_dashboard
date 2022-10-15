import React, { useState, useEffect } from 'react';

import { Dropdown } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const Searcher = ({ id, label, url, state, setState, getter = 'nombre' }) => {
    const { auth } = useAuthContext();
    const [data, setData] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getData = async () => {
            await getDataFrom(url, signal, auth.token)
                .then(response => {
                    setData(response.data.sort((info, anotherInfo) => info[getter].localeCompare(anotherInfo[getter])));
                })
                .catch(() => {
                    setData([]);
                })
        }
        getData();
        return () => { controller.abort(); };
    }, [auth, url, getter])

    return (
        <Dropdown id={id} label={label} size='small' state={state} setState={setState} options={data} getter={getter} required={true} />
    )
}

export default Searcher