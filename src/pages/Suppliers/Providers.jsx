import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, ExcelExport, PdfExport, Edit, Inject, Toolbar } from '@syncfusion/ej2-react-grids';

import { providersGrid } from '../../data/dummy';
import { Title } from '../../components';

const Providers = () => {

  // Se obtiene la data desde la API
  const providersData = [{ Code: 1, Name: 'insumo', Description: 'Descripción del insumo' },{ Code: 3, Name: 'Mate', Description: 'Descripción del insumo' }];

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Title category="Lista de" title="Insumos" />
      <GridComponent id='providerscomp' dataSource={providersData} allowPaging allowSorting toolbar={['Search']} width='auto'>
        <ColumnsDirective>
          {providersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, Search, Edit, ExcelExport, PdfExport, Toolbar]} />
      </GridComponent>
    </div>
  )
}

export default Providers