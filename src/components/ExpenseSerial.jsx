import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

import { Button, Input, Banner } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { regEx } from '../data/dummy';
import { URL_SN } from '../services/Api';
import { getDataByIdFrom } from '../services/GdrService';

const ExpenseSerial = ({ warehouse, product, state, setState, setClose }) => {
    const { themeColors } = useStateContext();
    const { auth, handleErrors } = useAuthContext()
    const refFocus = useRef(null);
    const [records, setRecords] = useState([]);
    const [serial, setSerial] = useState({ value: '', error: null });
    const [banner, setBanner] = useState({ value: '', error: null });
    const disabled = product.quantity <= state.filter(item => item.fk_producto === product.fk_producto).length;
    const URL = `${URL_SN}q/productoalmacen/${product.fk_producto}/${warehouse}/`

    useEffect(() => {
        let shadowBanner = setTimeout(() => setBanner({ error: null }), 4000);
        return () => { clearTimeout(shadowBanner) };
    });

    useEffect(() => {
        getDataByIdFrom(URL, 0, auth.token)
            .then(response => {
                setRecords(response.data)
            })
            .catch(() => setRecords([]))

    }, [URL, auth, handleErrors])

    const handleClose = async () => {
        if (!disabled) {
            setBanner({ value: { text: `¡Ups! Las series no estan completas. Series faltantes ${product.quantity - state.filter(item => item.fk_producto === product.fk_producto).length}`, background: '#FFC300' }, error: false })
        } else {
            setBanner({ value: { text: `Todas las series fueron seleccionadas`, background: themeColors?.confirm }, error: false })
        }
        await new Promise(r => setTimeout(r, 1500));
        setClose(false)
    }

    const handleCheck = (event) => {
        if (event.target.checked) {
            setState([...state, { fk_producto: product.fk_producto, fk_almacen: warehouse, sn: event.target.value }])
            setBanner({ value: { text: `Serial: ${event.target.value} fue seleccionado correctamente!`, background: themeColors?.primary }, error: false })
        } else {
            setState(current => current.filter(item => item.sn !== event.target.value))
            setBanner({ value: { text: `Serial: ${event.target.value} fue quitado de la lista`, background: '#FFC300' }, error: false })
        }
    }

    const handleAdd = (event) => {
        event.preventDefault()
        const input = new FormData(event.target).get('serials')
        if (records.map(item => item.sn).includes(input)) {
            if (!state.includes(input) && input !== '') {
                setState([...state, { fk_producto: product.fk_producto, fk_almacen: warehouse, sn: input }])
                setBanner({ value: { text: `Serial: ${input} seleccionado`, background: themeColors?.primary }, error: false })
            }
        } else {
            setBanner({ value: { text: `Serial: ${input} no se encuentra en la lista`, background: '#FFC300' }, error: false })
        }
        setSerial({ ...serial, value: '' })
    }

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            {banner.error !== null && <Banner text={banner.value.text} backgroundColor={banner.value.background} setState={() => setBanner({ value: '', error: null })} />}
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white dark:bg-secondary-dark-bg w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <form onSubmit={handleAdd} className='w-full flex  justify-center items-center gap-2'>
                        <Input id='serials' useRef={refFocus} label='Ingrese los números de serie' css='w-full' state={serial} setState={setSerial} regEx={regEx.alphanumeric} disabled={disabled} helperText='El campo no puede estar vacío' />
                        <Button type='submit' borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} height='normal' text='Cargar número de serie' width='1/2' />
                    </form>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                        {records.map((serial, index) => (
                            <div key={index} className='w-full flex items-center gap-2 p-4 border rounded-full shadow dark:text-slate-100'>
                                <input type='checkbox' id={`serial-${index}`} name={serial.sn} value={serial.sn} checked={state.some(item => item.sn === serial.sn)} onChange={handleCheck} disabled={!state.find(item => item.sn === serial.sn) && disabled} />
                                {serial.sn}
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-2 justify-center pt-5'>
                        <Button customFunction={handleClose} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Guardar y continuar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpenseSerial