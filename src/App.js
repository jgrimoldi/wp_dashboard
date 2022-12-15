import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { HomeNavigation, HomeTemplate, ProtectedRoutes } from './components';
import { Dashboard, Storage, Clients, Products, ProductType, Units, Providers, Category, Income, IncomeList, Expenses, Transfer, Stats, Reports, Register, Settings, Backup, Help, Login, ForgotPassword, ResetPassword, AccountValidation, Unauthorized, NotFound, Employees, NotValid, ExpensesList, TransferList, RMA } from './pages';
import './App.css';

import { useAuthContext } from './contexts/ContextAuth';

const App = () => {
  const { auth } = useAuthContext();
  const isAllowed = !!auth?.token && !!auth?.user;

  return (
    <BrowserRouter>
      <Routes>

        {/* login */}
        <Route element={(<HomeTemplate />)}>
          <Route path='/' element={(<Login />)} />
          <Route path='/inicio' element={(<Login />)} />
          <Route path='/recuperacion' element={<ForgotPassword />} />
          <Route path='/restauracion/:token' element={<ResetPassword />} />
          <Route path='/validacion/:token' element={<AccountValidation />} />
          <Route path='/ups' element={
            <ProtectedRoutes isAllowed={!!auth?.notValid} redirectTo='/inicio'>
              <NotValid />
            </ProtectedRoutes>
          } />
        </Route>

        <Route element={(<HomeNavigation />)}>
          <Route element={<ProtectedRoutes isAllowed={isAllowed} redirectTo='/inicio' />}>
            {/* dashboard */}
            <Route path='/dashboard' element={<Dashboard />} />
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
            <Route path='/devolucion-productos' element={<RMA />} />
            {/* moves-list */}
            <Route path='/lista-de-ingresos' element={<IncomeList />} />
            <Route path='/lista-de-egresos' element={<ExpensesList />} />
            <Route path='/lista-de-movimientos' element={<TransferList />} />
            {/* reports */}
            <Route path='/estadisticas' element={<Stats />} />
            <Route path='/reportes' element={<Reports />} />
            {/* management */}
            <Route path='/registro' element={<Register />} />
            <Route path='/usuarios' element={<Employees />} />
            <Route path='/restaurar' element={<Backup />} />
            {/* users */}
            <Route path='/perfil' element={<Settings />} />
            <Route path='/ayuda' element={<Help />} />
          </Route>
          <Route path='/401' element={<Unauthorized />} />
        </Route>

        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App