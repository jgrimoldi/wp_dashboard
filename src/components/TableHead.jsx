import React from 'react'

const TableHead = ({ headSource, checkbox }) => {
  return (
    <thead className='bg-gray-50 border-b-2 border-gray-200'>
      <tr>
        {checkbox && <th className='p-3 text-sm font-semibold tracking-wide text-left'></th>}
        {headSource.map((item, index) => (
          <th key={index} className='p-3 text-sm font-semibold tracking-wide text-left'>{item.name}</th>
        ))
        }
      </tr>
    </thead>
  )
}

export default TableHead