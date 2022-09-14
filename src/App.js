import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header, Sidebar } from './components';
import { Dashboard, Storage, Clients, Products, ProductType, Units, Providers, Category, Income, Expenses, Transfer, Stats, Reports, Register, Settings, Backup, Help } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { activeMenu, setActiveMenu } = useStateContext();

  return (
    <div>
      <BrowserRouter>
        <div className='flex relative dark:bg-main-dark-bg'>
          {activeMenu ? (
            <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
              <Sidebar />
            </div>
          ) : (
            <div className='w-0 dark:bg-secondary-dark-bg'>
              <Sidebar />
            </div>
          )}

          <div className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
              <Header />
            </div>
          </div>

          <div>
            <Routes>
              {/* dashboard */}
              <Route path='/' element={(<Dashboard />)} />
              <Route path='/dashboard' element={(<Dashboard />)} />
              <Route path='/almacen' element={<Storage />} />
              <Route path='/clientes' element={<Clients />} />
              {/* products */}
              <Route path='/productos' element={<Products />} />
              <Route path='/tipo-de-productos' element={<ProductType />} />
              <Route path='/unidades-de-medida' element={<Units />} />
              {/* suppliers */}
              <Route path='/proveedores' element={<Providers />} />
              <Route path='/categoria-de-proveedores' element={<Category />} />
              {/* moves */}
              <Route path='/ingresos' element={<Income />} />
              <Route path='/egresos' element={<Expenses />} />
              <Route path='/transferencia-entre-almacenes' element={<Transfer />} />
              {/* reports */}
              <Route path='/estadisticas' element={<Stats />} />
              <Route path='/reportes' element={<Reports />} />
              {/* management */}
              <Route path='/registro' element={<Register />} />
              <Route path='/perfil' element={<Settings />} />
              <Route path='/restaurar' element={<Backup />} />

              <Route path='/ayuda' element={<Help />} />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </div>
  )
}

export default App