import React from 'react';
// import { BsSearch } from 'react-icons/bs';

// import { incomeGrid } from '../data/dummy.js';
import { Title, SEO } from '../components';

const Income = () => {

  // const date = new Date();
  // const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
  // const currentDate = `${year}-${month < 10 ? '0' + month : month}-${day}`

  return (
    <>
      <SEO title='Compra de productos' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Compra de" title="Productos" />
        <div className='flex flex-wrap items-center w-full gap-5 mb-10'>


        </div>

      </div>
    </>
  )
}

export default Income