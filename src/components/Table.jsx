import React from 'react'

const Table = ({ childrenHead, childrenData, children }) => {
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
        </>
    )
}

export default Table