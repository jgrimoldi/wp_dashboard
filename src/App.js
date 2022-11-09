import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { HomeNavigation, HomeTemplate, ProtectedRoutes } from './components';
import { Dashboard, Storage, Clients, Products, ProductType, Units, Providers, Category, Income, Expenses, Transfer, Stats, Reports, Register, Settings, Backup, Help, Login, ForgotPassword, ResetPassword, AccountValidation, Unauthorized, NotFound, Employees, NotValid } from './pages';
import './App.css';

import { useAuthContext } from './contexts/ContextAuth';

const App = () => {

  const privateRoles = [2, 3];
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
            {/* reports */}
            <Route path='/estadisticas' element={<Stats />} />
            <Route path='/reportes' element={<Reports />} />
            {/* management */}
            <Route path='/registro' element={
              <ProtectedRoutes isAllowed={isAllowed && privateRoles.includes(auth.user.fk_perfil)} redirectTo='/401'>
                <Register />
              </ProtectedRoutes>
            } />
            <Route path='/empleados' element={<Employees />} />
            <Route path='/perfil' element={<Settings />} />
            <Route path='/restaurar' element={<Backup />} />

            <Route path='/ayuda' element={<Help />} />
            <Route path='/401' element={<Unauthorized />} />

          </Route>
        </Route>

        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App