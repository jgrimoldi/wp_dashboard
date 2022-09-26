import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeNavigation } from './components';

import { Dashboard, Storage, Clients, Products, ProductType, Units, Providers, Category, Income, Expenses, Transfer, Stats, Reports, Register, Settings, Backup, Help, Login, ForgotPassword, ResetPassword, AccountValidation } from './pages';

import './App.css';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* login */}
        <Route path='/' element={(<Login />)} />
        <Route path='/inicio' element={(<Login />)} />
        <Route path='/recuperacion' element={<ForgotPassword />} />
        <Route path='/restauracion' element={<ResetPassword />} />
        <Route path='/validacion' element={<AccountValidation />} />


        <Route element={(<HomeNavigation />)}>
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
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App