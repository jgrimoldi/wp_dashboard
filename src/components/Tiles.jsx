import React, { useState, useEffect } from 'react';
import { BsPlus } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { getDataFrom } from '../services/GdrService';

const Tiles = ({ title, url, token, text, to }) => {
    const [data, setData] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getData = (url, token) => {
            getDataFrom(url, signal, token)
                .then(response => {
                    setData(response.data.length)
                })
                .catch(() => {
                    setData(0)
                })
        }

        getData(url, token);
        return () => { controller.abort(); };
    }, [data, token, url]);


    return (
        <div className='min-w-fit w-full sm:w-1/3 flex-auto flex flex-col gap-2 items-center justify-between rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] dark:from-[#A2A5FA] dark:to-[#C4A2FA]
        dark:text-slate-900  text-white shadow-xl'>
            <p className='capitalize text-xs'>{title} totales</p>
            <p className='text-5xl font-[monospace] text-center'>{data}</p>
            <NavLink to={to} className='border-t border-opacity-70 flex items-center opacity-70 text-14 pt-2 hover:opacity-100'><span className='text-xl'><BsPlus /></span>Agregar nuevo {text}</NavLink>
        </div>
    )
}

export default Tiles