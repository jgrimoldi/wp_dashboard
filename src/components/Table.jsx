import React, { useState, useEffect, useCallback } from 'react';
import { BsCloudArrowDown, BsPlus, BsSearch } from 'react-icons/bs';

import { Input, TableHead, Pagination } from '.';
import useTable from '../hooks/useTable';

const Dates = ({ date }) => {
    const fullDate = new Date(date);

    const formatDate = (date) => date < 10 ? `0${date}` : date

    const year = formatDate(fullDate.getFullYear());
    const month = formatDate(fullDate.getMonth() + 1);
    const day = formatDate(fullDate.getDate());
    const hours = formatDate(fullDate.getHours());
    const seconds = formatDate(fullDate.getMinutes());

    return (
        <>
            {year}-{month}-{day} {hours}:{seconds}
        </>
    )
};

export const Radio = ({ data, state, setState }) => {

    const handleChange = (event) => setState(event.target.value);

    return (
        <input
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            defaultValue={data.id}
            onChange={handleChange}
            type='checkbox' name='table'
            checked={Number(state) === data.id}
        />
    )
};

const AddBarCode = ({ data, setOpen, setProductID }) => {

    const handleClick = (id) => {
        setProductID(Number(id));
        setOpen(true);
    }

    return (
        <button type='button' onClick={() => handleClick(data.id)} style={{ backgroundColor: 'blue' }} className='flex gap-2 items-center border p-1.5 rounded-xl text-white hover:shadow-lg'>
            Agregar <span className='text-xl'><BsPlus></BsPlus></span>
        </button>
    )
}

const FormatDesktop = ({ data, property }) => {
    if (property.field === 'url') {
        return (
            <a href={data[property.field]} style={{ color: 'blue' }}
                className='flex items-center gap-1 font-bold hover:underline'
                target='_blank' rel="noreferrer" download='filename' >
                Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
            </a>
        );
    }

    // if (property.field === 'imagen') {
    //     return (<img className='w-20 h-20' src={noImage} alt={`ID de producto: ${data.id}`} />);
    // }

    if (property.field === 'Fecha Creación' || property.field === 'lastlogin') {
        return (<Dates date={data[property.field]} />);
    }

    if (property.field === 'validateAccount') {
        if (data[property.field] === null || data[property.field] === false)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50'>Sin validar</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50'>Validado</span>);
    }

    return (<>{data[property.field]}</>);
}

const FormatMobile = ({ data, property }) => {
    if (property.mobile === 'cantidad') {
        return (data[property.mobile] + ' Unidad/es');
    }

    if (property.mobile === 'url') {
        return (<a href={data[property.mobile]} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
            Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
        </a>);
    }

    // if (property.mobile === 'imagen') {
    //     return (<img className="rounded-full h-20" src={noImage} alt={`ID de producto: ${data.id}`} />);
    // }

    if (property.mobile === 'Fecha Creación' || property.mobile === 'lastlogin') {
        return (<Dates date={data[property.mobile]} />);
    }

    if (property.mobile === 'validateAccount') {
        if (data[property.mobile] === null || data[property.mobile] === false)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50'>Sin validar</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50'>Validado</span>);
    }

    return (<>{data[property.mobile]}</>);
}

const Table = ({ header, data, filterTitle, checkbox, stateCheckbox, setStateCheckbox, barcode, setOpenBarcode, setProductID }) => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { slice, range } = useTable(data, page, rowsPerPage);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });
    const [mobileData, setMobileData] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

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
                <Input id='filter' label={`Buscar en ${filterTitle}`} size='small' css='w-full sm:w-1/2'
                    state={filteredValue} setState={setFilteredValue}
                    tooltip={`Filtrar ${filterTitle}`} color='blue' icon={<BsSearch />}
                />
            </div>
            <div className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className='w-full table-auto'>
                    <TableHead headSource={header} checkbox={checkbox} barcode={barcode} />
                    <tbody>
                        {data.length !== 0 ?
                            slice.filter(ifIncludes).map((data, index) =>
                                <tr key={index} className='bg-white even:bg-gray-50'>
                                    {checkbox && <td className='w-fit p-3 text-sm text-gray-700 whitespace-nowrap'><Radio data={data} state={stateCheckbox} setState={setStateCheckbox} /></td>}
                                    {header.map((property, key) =>
                                        <td key={key} className='w-fit p-3 text-sm text-gray-700 whitespace-nowrap'>
                                            <FormatDesktop data={data} property={property} />
                                        </td>
                                    )}
                                    {barcode && <td className='w-fit p-3 text-sm text-center text-gray-700 whitespace-nowrap'><AddBarCode data={data} setOpen={setOpenBarcode} setProductID={setProductID} /></td>}
                                </tr>
                            )
                            : <tr className='text-center bg-white even:bg-gray-50'><td className='p-3 text-sm text-gray-700 whitespace-nowrap'>No hay entradas para mostrar</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-4'>
                {data.length !== 0 ?
                    slice.map((data, index) => (
                        <div key={index} className='bg-white space-y-3 p-4 rounded-lg shadow'>
                            <div className='flex items-center space-x-2 text-sm'>
                                {checkbox && <Radio data={data} state={stateCheckbox} setState={setStateCheckbox} />}
                                {mobileData[0].map((property, index) => (
                                    <div key={index}><FormatMobile data={data} property={property} /></div>
                                ))}
                            </div>
                            {mobileData.slice(1).map((elements, index) => (
                                <div key={index} className='flex flex-wrap gap-3'>
                                    {elements.map((property, index) => (
                                        <div key={index} className='whitespace-nowrap'><FormatMobile data={data} property={property} /></div>
                                    ))}
                                </div>
                            ))}
                            {barcode && <div><AddBarCode data={data} setOpen={setOpenBarcode} setProductID={setProductID} /></div>}
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