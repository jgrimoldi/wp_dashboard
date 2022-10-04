import React from 'react';

import useTable from '../hooks/useTable';
import { Pagination } from '.';

const Table = ({ childrenHead, childrenData, data, page, setPage, rowsPerPage, children }) => {
    const { slice, range } = useTable(data, page, rowsPerPage);

    return (
        <>
            <div className='overflow-auto rounded-lg shadow hidden md:block'>
                <table className='w-full table-auto'>
                    {childrenHead}
                    <tbody>
                        {childrenData}
                    </tbody>
                </table>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'>
                {children}
            </div>
            <Pagination range={range} slice={slice} data={data} setPage={setPage} page={page} />
        </>
    )
}

export default Table