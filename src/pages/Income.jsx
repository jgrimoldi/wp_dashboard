import React, { useState } from 'react';
import { BsSearch, BsPlus } from 'react-icons/bs';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject, Edit } from '@syncfusion/ej2-react-grids';

import { incomeGrid } from '../data/dummy.js';
import { Title, Input, Dropdown } from '../components';


const Income = () => {

  const date = new Date();
  const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
  const currentDate = `${year}-${month < 10 ? '0' + month : month}-${day}`
  // const initialValues = { provider: '', providerName: '', storage: '', date: '' };
  // const [headerData, setHeaderData] = useState(initialValues);
  const [products, setProducts] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [incomeData, setIncomeData] = useState([]);

  const handleIncome = (newProduct) => {

    const newIncome = {
      Code: 0,
      Product: newProduct,
      Amount: 0,
      Price: 0,
      Partial: 0,
    };

    setIncomeData([...incomeData, newIncome]);
  }

  return (
    <div className='m-2 mt-20 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Title category="Compra de" title="Productos" />
      <div className='flex flex-wrap items-center w-full gap-5 mb-10'>
        <Input id='provider' label='Proveedor' tooltip='Buscar proveedor' color='blue' icon={<BsSearch />} />
        <Input id='providerName' label='Nombre del proveedor' color='blue' css='w-full md:w-6/12' />
        <Input id='storage' label='Almacén' tooltip='Buscar almacén' color='blue' icon={<BsSearch />} />
        <Input id='date' type='date' value={currentDate} label='Fecha de compra' color='blue' />
        <div className='w-5/6'>
          <Dropdown id='product' handleChange={(newValue) => setSelectedProduct(newValue)} value={selectedProduct} options={products} label='Agregar producto' tooltip='Agregar producto' customFunction={() => handleIncome(selectedProduct)} color='blue' icon={<BsPlus />} />
        </div>
      </div>
      <GridComponent
        dataSource={incomeData}
        editSettings={{ allowEditing: true }}
        width='auto'
      >
        <ColumnsDirective>
          {incomeGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Edit]} />
      </GridComponent>
      <div className='flex gap-5 justify-end pt-5'>
        <button type='button' style={{ border: '1px solid blue', borderColor: 'blue', backgroundColor: 'transparent', color: 'black' }} className='text-md p-3 hover:drop-shadow-xl rounded-md'>Cancelar</button>
        <button type='button' style={{ border: '1px solid blue', backgroundColor: 'blue', color: 'white' }} className='text-md p-3 hover:drop-shadow-xl rounded-md'>Guardar</button>
      </div>
    </div >
  )
}

export default Income