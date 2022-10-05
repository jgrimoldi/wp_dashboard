import React, { useState, useEffect, useCallback } from 'react';
import { BsCloudArrowDown, BsSearch } from 'react-icons/bs';

import { Input, TableHead, Pagination } from '.';
import useTable from '../hooks/useTable';

const Table = ({ header, data }) => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { slice, range } = useTable(data, page, rowsPerPage);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });
    const [mobileData, setMobileData] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

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
    }, [setMobileData, header, sliceData, isMounted]);

    // filter(backup => backup.nombre.includes(filteredValue.value) || backup.createdBy.includes(filteredValue.value) || backup.size.includes(filteredValue.value))

    return (
        <>
            <div className='shadow flex justify-end p-2 bg-gray-50 border-b-2 border-gray-200'>
                <Input id='filter' label='Buscar en Mis Backups' size='small' css='w-full sm:w-1/2'
                    state={filteredValue} setState={setFilteredValue}
                    tooltip='Filtrar mis backups' color='blue' icon={<BsSearch />}
                />
            </div>
            <div className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className='w-full table-auto'>
                    <TableHead headSource={header} />
                    <tbody>
                        {data.length !== 0 ?
                            slice.map((data, index) =>
                                <tr key={index} className='bg-white even:bg-gray-50'>
                                    {
                                        header.map((id, key) =>
                                            <td key={key} className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                                                {id.field === 'url'
                                                    ?
                                                    <a href={data[id.field]} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
                                                        Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
                                                    </a>
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
                                {
                                    mobileData[0].map((id, index) => (
                                        <div key={index}>{data[id.mobile]}</div>
                                    ))
                                }
                            </div>
                            <div className='flex flex-wrap gap-3'>
                                {
                                    mobileData[1].map((id, index) => (
                                        <div key={index} className='whitespace-nowrap'>{
                                            id.mobile === 'url'
                                                ?
                                                <a href={data[id.mobile]} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
                                                    Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
                                                </a>
                                                :
                                                data[id.mobile]
                                        }</div>
                                    ))
                                }
                            </div>
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


// <div className='flex items-center space-x-2 text-sm'>
// <div style={{ backgroundColor: 'blue' }} className='flex items-center justify-center w-6 h-6 text-white rounded-full'>{item.id}</div>
// <div>{item.createdBy}</div>
// <div>{item.size}</div>
// </div>

// <div className='flex flex-wrap gap-3'>
// <div className='whitespace-nowrap'>{item.nombre}</div>
// <div className='whitespace-nowrap'>
//     <a href={item.url} style={{ color: 'blue' }} className='flex items-center gap-1 font-boldhover:underline' target='_blank' rel="noreferrer" download='filename'>
//         Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
//     </a>
// </div>
// </div>

export default Table