import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';

import { clientsGrid } from '../data/dummy.js';
import { Title, SEO } from '../components';

const Clients = () => {

  const clientsData = [{
    Code: 1,
    Name: 'John',
    Address: 'Street 2',
    Zip: 6740,
    Phone: 2352403934,
    Email: 'johndoe@example.com',
    Description: 'Es el johnnn doeee',
  },
  {
    Code: 2,
    Name: 'Mario',
    Address: 'Street 5',
    Zip: 6740,
    Phone: 2352403934,
    Email: 'johndoe@example.com',
    Description: 'Es el Mariooo doeee',
  },];

  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search'];

  return (
    <>
      <SEO title='Clientes' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Lista de" title="Clientes" />
        <GridComponent
          dataSource={clientsData}
          allowPaging
          pageSettings={{ pageCount: 5 }}
          selectionSettings={selectionsettings}
          toolbar={toolbarOptions}
          allowSorting
          width='auto'
        >
          <ColumnsDirective>
            {clientsGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
        </GridComponent>
      </div>
    </>
  )
}

export default Clients