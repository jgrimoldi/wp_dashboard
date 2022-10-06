import React, { useState, useEffect, useCallback } from 'react';
import { BsCloudArrowDown, BsSearch } from 'react-icons/bs';

import { Input, TableHead, Pagination } from '.';
import noImage from '../data/imagen.jpg';
import useTable from '../hooks/useTable';

const Dates = ({ date }) => {
    let formatDate = new Date(date);

    return (
        <>
            {formatDate.getFullYear()}-{formatDate.getMonth() + 1}-{formatDate.getDate()}
        </>
    )
};

const Table = ({ header, data, checkbox }) => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { slice, range } = useTable(data, page, rowsPerPage);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });
    const [mobileData, setMobileData] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isClicked, setIsClicked] = useState('');

    const handleCheck = (event) => {
        setIsClicked(event.target.value);
    }

    const ifIncludes = (object) => {
        for (const key in object) {
            let newObject = object[key];
            if (typeof newObject === 'string' && newObject.includes(filteredValue.value))
                return true;
            if (typeof newObject === 'number' && newObject === Number(filteredValue.value))
                return true;

        }
        return false;
    }

    const sliceData = useCallback((data) => {
        let aux = [];
        let newData = [];
        for (let i = 1; i < data.length + 1; i++) {
            aux[i - 1] = data[i - 1];
            if (i % 3 === 0 && i % 5 !== 0) {
                newData.push(aux);
                aux = [];
            }
        }
        newData.push(aux);
        setIsMounted(true);
        return newData;
    }, []);

    useEffect(() => {
        if (isMounted === false) {
            const sliceHeader = sliceData(header);
            setMobileData(sliceHeader);
        }
    }, [header, sliceData, isMounted]);

    return (
        <>
            <div className='shadow flex justify-end p-2 bg-gray-50 border-b-2 border-gray-200'>
                <Input id='filter' label='Buscar en Mis Backups' size='small' css='w-full sm:w-1/2'
                    state={filteredValue} setState={setFilteredValue}
                    tooltip='Filtrar Mis Backups' color='blue' icon={<BsSearch />}
                />
            </div>
            <div className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className='w-fit lg:w-full table-auto'>
                    <TableHead headSource={header} checkbox={checkbox} />
                    <tbody>
                        {data.length !== 0 ?
                            slice.filter(ifIncludes).map((data, index) =>
                                <tr key={index} className='bg-white even:bg-gray-50'>
                                    {checkbox && <td className='w-fit p-3 text-sm text-gray-700 whitespace-nowrap'>
                                        <input value={data.id} onChange={handleCheck}
                                            type='radio' name='table'
                                            checked={Number(isClicked) === data.id}
                                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
                                    </td>}
                                    {
                                        header.map((id, key) =>
                                            <td role='button' key={key} className='w-fit p-3 text-sm text-gray-700 whitespace-nowrap'>
                                                {id.field === 'url'
                                                    ?
                                                    <a href={data[id.field]} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
                                                        Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
                                                    </a>
                                                    : id.field === 'imagen' ?
                                                        <img className='w-20 h-20' src={noImage} alt={`ID de producto: ${data.id}`} />
                                                        : id.field === 'Fecha Creación' ?
                                                            <Dates date={data[id.field]} />
                                                            :
                                                            data[id.field]
                                                }
                                            </td>
                                        )
                                    }
                                </tr>
                            )
                            : <tr className='text-center bg-white even:bg-gray-50'><td className='p-3 text-sm text-gray-700 whitespace-nowrap'>No hay entradas para mostrar</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'>
                {data.length !== 0 ?
                    slice.map((data, index) => (
                        <div key={index} className='bg-white space-y-3 p-4 rounded-lg shadow'>
                            <div className='flex items-center space-x-2 text-sm'>
                                <input value={data.id} type='radio' className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
                                {
                                    mobileData[0].map((id, index) => (
                                        <div key={index}>
                                            {
                                                id.mobile === 'cantidad'
                                                    ? data[id.mobile] + ' Unidad'
                                                    : data[id.mobile]
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            {mobileData.slice(1).map((elements, index) => (
                                <div key={index} className='flex flex-wrap gap-3'>
                                    {
                                        elements.map((id, index) => (
                                            <div key={index} className='whitespace-nowrap'>{
                                                id.mobile === 'url'
                                                    ?
                                                    <a href={data[id.mobile]} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
                                                        Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
                                                    </a>
                                                    : id.mobile === 'imagen' ?
                                                        <img className="rounded-full h-20" src={noImage} alt={`ID de producto: ${data.id}`} />
                                                        :
                                                        data[id.mobile]
                                            }</div>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    )
                    )
                    : <p className='p-3 text-sm text-gray-700 whitespace-nowrap'>No hay entradas para mostrar</p>
                }
            </div>

            <Pagination range={range} slice={slice} data={data} setPage={setPage} page={page} pageRows={rowsPerPage} setRows={setRowsPerPage} />
        </>
    )
}

export default Table