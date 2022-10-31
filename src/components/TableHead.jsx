import React from 'react'

const TableHead = ({ headSource, checkbox, barcode }) => {
  return (
    <thead className='bg-gray-50 dark:bg-secondary-dark-bg dark:text-gray-100 border-b-2 border-gray-200 dark:border-black'>
      <tr>
        {checkbox && <th className='p-3 text-sm font-semibold tracking-wide text-left'></th>}
        {headSource.map((item, index) => (
          <th key={index} className='p-3 text-sm font-semibold tracking-wide text-left'>{item.name}</th>
        ))
        }
        {barcode && <th className='p-3 text-sm font-semibold tracking-wide text-left'>Agregar</th>}
      </tr>
    </thead>
  )
}

export default TableHead