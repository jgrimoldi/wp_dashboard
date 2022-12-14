import React, { useState, useEffect, useCallback } from 'react';
import { GrDocumentCsv } from 'react-icons/gr';
import { BsCloudArrowDown, BsPlus, BsSearch, BsFilePdf } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { CSVLink } from 'react-csv';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Input, TableHead, Pagination, TablePDF, Button } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import useTable from '../hooks/useTable';
import { reSendValidation } from '../services/AuthService';

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
            className='w-4 h-4 text-blue-600 dark:text-purple-300 dark:accent-purple-300 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-purple-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            defaultValue={Number(data.id)}
            onChange={handleChange}
            type='checkbox' name='table'
            checked={Number(state) === Number(data.id)}
        />
    )
};

const AddBarCode = ({ data, setOpen, setProductID, field }) => {
    const { themeColors } = useStateContext();

    const handleClick = (id) => {
        setProductID(Number(id));
        setOpen(true);
    }

    function checkControlNS(data) {
        return data.hasOwnProperty('controlNS') && !Boolean(data.controlNS)
    }

    return (
        <button type='button' onClick={() => handleClick(data.id)} style={{ backgroundColor: field === 'C??digos de Barra' ? themeColors?.primary : checkControlNS(data) ? themeColors?.disabled : themeColors?.primary }}
            className='flex gap-2 items-center border p-1.5 rounded-xl text-white dark:text-black hover:shadow-lg' disabled={field === 'C??digos de Barra' ? false : checkControlNS(data)}>
            {field} <span className='text-xl'><BsPlus></BsPlus></span>
        </button>
    )
}

const FormatDesktop = ({ data, property }) => {
    const { themeColors } = useStateContext();
    const { auth } = useAuthContext();

    if (property.field === 'url') {
        return (
            <a href={data[property.field]} style={{ color: themeColors?.primary }}
                className='flex items-center gap-1 font-bold hover:underline'
                target='_blank' rel="noreferrer" download='filename' >
                Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
            </a>
        );
    }

    if (property.field === 'unitPrice' || property.field === 'price' || property.field === 'VAT' || property.field === 'subTotal') {
        return ('$' + data[property.mobile]);
    }

    // if (property.field === 'imagen') {
    //     return (<img className='w-20 h-20' src={noImage} alt={`ID de producto: ${data.id}`} />);
    // }

    if (property.field === 'Fecha Creaci??n' || property.field === 'lastlogin' || property.mobile === 'createdAt') {
        let date = new Date(data[property.field]);
        date = new Date(date.getTime() + 3 * 60 * 60 * 1000);
        return (<Dates date={date} />);
    }

    if (property.field === 'alicuota') {
        return (<>{data[property.field]}%</>);
    }

    if (property.field === 'validateAccount') {
        const today = new Date();
        let expires = new Date(data.validateAccountExpires);
        expires = new Date(expires.getTime() + 3 * 60 * 60 * 1000);

        if ((data[property.field] === null || data[property.field] === false) && expires < today) {
            return (
                <TooltipComponent content={`Reenviar validaci??n a ${data.email}`} position="BottomCenter">
                    <button onClick={() => reSendValidation(data.email, auth.token)} className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>
                        Sin validar
                    </button>
                </TooltipComponent>
            );
        }
        if (expires >= today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Sin validar</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 dark:bg-green-800 dark:text-green-200 rounded-lg bg-opacity-50'>Validado</span>);
    }

    if (property.field === 'validateAccountExpires') {
        const today = new Date();
        let expires = new Date(data[property.field]);
        expires = new Date(expires.getTime() + 3 * 60 * 60 * 1000);

        if (Number(data.validateAccount) === 1)
            return (<span className=''></span>);
        if (expires >= today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 rounded-lg bg-opacity-50'>Pendiente</span>);
        if (expires < today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Rechazado</span>);
    }

    if (property.field === 'resetPasswordExpires') {
        const today = new Date();
        if (data.resetPasswordExpires === null)
            return (<span className=''></span>);
        if (new Date(data[property.field]) <= today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 rounded-lg bg-opacity-50'>Pendiente</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Expirado</span>);
    }

    return (<>{data[property.field]}</>);
}

const FormatMobile = ({ data, property }) => {
    const { themeColors } = useStateContext();
    if (property.mobile === 'cantidad') {
        return (data[property.mobile] + ' Unidad/es');
    }

    if (property.mobile === 'unitPrice' || property.mobile === 'price' || property.mobile === 'VAT' || property.mobile === 'subTotal') {
        return ('$' + data[property.mobile]);
    }

    if (property.mobile === 'url') {
        return (<a href={data[property.mobile]} style={{ color: themeColors?.primary }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
            Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
        </a>);
    }

    // if (property.mobile === 'imagen') {
    //     return (<img className="rounded-full h-20" src={noImage} alt={`ID de producto: ${data.id}`} />);
    // }

    if (property.field === 'alicuota') {
        return (<>{data[property.field]}%</>);
    }

    if (property.mobile === 'Fecha Creaci??n' || property.mobile === 'lastlogin' || property.mobile === 'createdAt') {
        return (<Dates date={data[property.mobile]} />);
    }

    if (property.mobile === 'validateAccount') {
        if (data[property.mobile] === null || data[property.mobile] === false)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50'>Sin validar</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50'>Validado</span>);
    }

    if (property.field === 'validateAccountExpires') {
        const today = new Date();
        if (data.validateAccount === null && new Date(data[property.field]) <= today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50'>Pendiente</span>);
        if (data.validateAccount === null && new Date(data[property.field]) > today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50'>Rechazado</span>);

        return (<span className=''></span>);
    }

    if (property.field === 'resetPasswordExpires') {
        const today = new Date();
        if (data.resetPasswordExpires === null)
            return (<span className=''></span>);
        if (new Date(data[property.field]) <= today)
            return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50'>Pendiente</span>);

        return (<span className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 rounded-lg bg-opacity-50'>Expirado</span>);
    }

    return (<>{data[property.mobile]}</>);
}

const Table = ({ header, headerPDF = header, data, filterTitle, sortFunction, checkbox, stateCheckbox, setStateCheckbox, barcode, setOpenBarcode, fieldName = 'Agregar', setProductID, report = false }) => {
    const { themeColors } = useStateContext();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { slice, range } = useTable(data, page, rowsPerPage, sortFunction);
    const [filteredValue, setFilteredValue] = useState({ value: '', error: null });
    const [mobileData, setMobileData] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const date = new Date();
    const aaaammdd = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${(date.getDate()).toString().padStart(2, '0')}`
    const hhmmss = date.toTimeString().substring(0, 2) + date.toTimeString().substring(3, 5) + date.toTimeString().substring(6, 8);
    const ddmmaaaa = `${aaaammdd.slice(6, 8).padStart(2, '0')}/${aaaammdd.slice(4, 6).padStart(2, '0')}/${aaaammdd.slice(0, 4)}`;
    const hh_mm_ss = `${hhmmss.slice(0, 2)}:${hhmmss.slice(2, 4)}:${hhmmss.slice(4, 6)}`
    const title = filterTitle.split(" ").slice(1).join(" ");

    console.log()

    const ifIncludes = (object) => {
        for (const key in object) {
            let newObject = object[key];
            if (typeof newObject === 'string' && newObject.toLowerCase().includes((filteredValue.value).toLowerCase()))
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

    const handleCSV = () => {
        const aux = data.map(info => {
            const record = {};
            headerPDF.forEach(column => {
                record[column.field] = info[column.field];
            });
            return record;
        });
        return aux;
    }

    return (
        <>
            <div className='shadow flex justify-end gap-1 p-2 bg-gray-50 dark:bg-secondary-dark-bg'>
                <Input id='filter' label={`Buscar en ${filterTitle}`} size='small' css='w-full sm:w-1/2'
                    state={filteredValue} setState={setFilteredValue}
                    tooltip={`Filtrar ${filterTitle}`} color={themeColors?.primary} icon={<BsSearch />}
                />
                {report &&
                    <>
                        <PDFDownloadLink
                            document={<TablePDF header={headerPDF} data={data} info={{ title, ddmmaaaa, hh_mm_ss, receipt: `${aaaammdd}${hhmmss}` }} />}
                            fileName={`${aaaammdd}${hhmmss}_Reporte-${title}-PDF.pdf`}>
                            <TooltipComponent content='Exportar tabla a PDF' position="TopCenter">
                                <Button customFunction={() => { }} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='' icon={<BsFilePdf />} />
                            </TooltipComponent>
                        </PDFDownloadLink>
                        <CSVLink data={handleCSV()} filename={`${aaaammdd}${hhmmss}_Reporte-${title}-CSV.csv`} separator=', ' enclosingCharacter={`'`} target='_blank'>
                            <TooltipComponent content='Exportar tabla a CSV' position="TopCenter">
                                <Button customFunction={() => { }} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='' icon={<GrDocumentCsv />} />
                            </TooltipComponent>
                        </CSVLink>
                    </>
                }
            </div>
            <div style={{ width: 'calc(100 / 7% - 20px)' }} className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className='w-full table-auto'>
                    <TableHead headSource={header} checkbox={checkbox} barcode={barcode} field={fieldName} />
                    <tbody>
                        {data.length !== 0 ?
                            slice.filter(ifIncludes).map((data, index) =>
                                <tr key={index} className='bg-white dark:bg-secondary-dark-bg'>
                                    {checkbox && <td className='w-fit p-3 text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'><Radio data={data} state={stateCheckbox} setState={setStateCheckbox} /></td>}
                                    {header.map((property, key) =>
                                        <td key={key} className='w-fit p-3 text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'>
                                            <FormatDesktop data={data} property={property} />
                                        </td>
                                    )}
                                    {barcode && <td className='w-fit p-3 text-sm text-center text-gray-700 dark:text-gray-100 whitespace-nowrap'><AddBarCode data={data} setOpen={setOpenBarcode} setProductID={setProductID} field={fieldName} /></td>}
                                </tr>
                            )
                            : <tr className='text-center bg-white dark:bg-secondary-dark-bg'><td className='p-3 text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'>No hay entradas para mostrar</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mt-4'>
                {data.length !== 0 ?
                    slice.map((data, index) => (
                        <div key={index} className='bg-white dark:bg-secondary-dark-bg space-y-3 p-4 rounded-lg shadow'>
                            <div className='flex items-center space-x-2 text-sm dark:text-gray-100'>
                                {checkbox && <Radio data={data} state={stateCheckbox} setState={setStateCheckbox} />}
                                {mobileData[0].map((property, index) => (
                                    <div key={index}><FormatMobile data={data} property={property} /></div>
                                ))}
                            </div>
                            {mobileData.slice(1).map((elements, index) => (
                                <div key={index} className='flex flex-wrap gap-3 dark:text-gray-100'>
                                    {elements.map((property, index) => (
                                        <div key={index} className='whitespace-nowrap'><FormatMobile data={data} property={property} /></div>
                                    ))}
                                </div>
                            ))}
                            {barcode && <div><AddBarCode data={data} setOpen={setOpenBarcode} setProductID={setProductID} field={fieldName} /></div>}
                        </div>
                    )
                    )
                    : <p className='p-3 text-sm text-gray-700 dark:text-gray-100 whitespace-nowrap'>No hay entradas para mostrar</p>
                }
            </div>

            <Pagination range={range} slice={slice} data={data} setPage={setPage} page={page} pageRows={rowsPerPage} setRows={setRowsPerPage} />
        </>
    )
}

export default Table