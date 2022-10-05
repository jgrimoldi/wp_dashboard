import React, { useEffect } from 'react';

const Pagination = ({ range, setPage, page, slice, data, pageRows, setRows }) => {

    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
            setPage(page - 1);
        }
    }, [slice, page, setPage]);

    const activeLink = 'py-2 px-3 text-white dark:border-gray-700 dark:bg-gray-700 dark:text-white';
    const normalLink = 'py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'

    return (
        <div className="flex flex-col justify-center pt-4 sm:flex-row sm:justify-between items-center">
            <div className='flex gap-2 items-center'>
                <select className='border border-black rounded-lg p-0.5' name='rowsPerPage' value={pageRows} onChange={(event) => setRows(event.target.value)}>
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>

                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Mostrando <span className="font-semibold text-gray-900 dark:text-white">{page}</span> a <span className="font-semibold text-gray-900 dark:text-white">{range.slice(-1)}</span> de <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span> Entradas
                </span>
            </div>

            <div className="inline-flex mt-2 xs:mt-0 border rounded-r">
                <button className="py-2 px-4 text-sm font-medium rounded-l hover:text-blue-700 hover:bg-blue-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    Anterior
                </button>
                <div className='inline-flex -space-x-px'>
                    {range.map((element, index) => (
                        <button
                            key={index}
                            aria-current={page === element ? 'page' : ''}
                            style={{ backgroundColor: page === element ? 'blue' : '' }}
                            className={page === element ? activeLink : normalLink}
                            onClick={() => { setPage(element) }}
                        >
                            {element}
                        </button>
                    ))}
                </div>
                <button className="py-2 px-4 text-sm font-medium rounded-l hover:text-blue-700 hover:bg-blue-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    Siguiente
                </button>
            </div>
        </div>
    )
}

export default Pagination