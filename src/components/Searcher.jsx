import React, { useState } from 'react';
import { useEffect } from 'react';
import { Table, Button } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const Searcher = ({ header, filter, setValue, setShowModal }) => {
    const { auth } = useAuthContext();
    const [stateCheckbox, setStateCheckbox] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getData = async () => {
            await getDataFrom(header[0][0], signal, auth.token)
                .then(response => {
                    setData(response.data);
                })
                .catch(() => {
                    setData([]);
                })
        }
        getData();
        return () => { controller.abort(); };
    }, [auth, header])

    const handleClose = () => setShowModal(false);

    const handleSubmit = () => {
        setValue((prevState) => { return { ...prevState, value: stateCheckbox, error: false } });
        handleClose();
    };

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            <div className='h-screen flex items-center justify-center'>
                <div className='bg-white w-11/12 sm:w-4/5 lg:w-1/2 p-5 rounded-3xl'>
                    <Table header={header[1]} data={data} filterTitle={filter} checkbox={true} stateCheckbox={stateCheckbox} setStateCheckbox={setStateCheckbox} />
                    <div className='float-right flex gap-2 mt-5'>
                        <Button customFunction={handleClose} borderColor='black' color='black' backgroundColor='transparent' text='Cerrar' />
                        <Button type='submit' customFunction={handleSubmit} borderColor='blue' color='white' backgroundColor='blue' text='Seleccionar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Searcher