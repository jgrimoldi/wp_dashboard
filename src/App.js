import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { HomeNavigation, HomeTemplate, ProtectedRoutes } from './components';
import { Dashboard, Storage, Clients, Products, ProductType, Units, Providers, Category, Income, IncomeList, Expenses, Transfer, Stats, Reports, Register, Settings, Backup, Help, Login, ForgotPassword, ResetPassword, AccountValidation, Unauthorized, NotFound, Employees, NotValid, ExpensesList, TransferList, RMA } from './pages';
import './App.css';

import { useAuthContext } from './contexts/ContextAuth';
import { usePermissionsContext } from './contexts/ContextPermissions';

const App = () => {
  const privateRoles = [2, 3];
  const { auth } = useAuthContext();
  const { allowedPages } = usePermissionsContext();
  const isAllowed = !!auth?.token && !!auth?.user;
  const isPermitted = isAllowed && privateRoles.includes(auth.user.fk_perfil)

  function havePermissions(aProperty) {
    if (privateRoles.includes(auth.user?.fk_perfil))
      return isPermitted

    return isPermitted && allowedPages[aProperty]
  }

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
            <Route path='/lista-de-ingresos' element={
              <ProtectedRoutes isAllowed={havePermissions('/lista-de-ingresos')} redirectTo='/401' >
                <IncomeList />
              </ProtectedRoutes>
            } />
            <Route path='/lista-de-egresos' element={
              <ProtectedRoutes isAllowed={havePermissions('/lista-de-egresos')} redirectTo='/401' >
                <ExpensesList />
              </ProtectedRoutes>
            } />
            <Route path='/lista-de-movimientos' element={
              <ProtectedRoutes isAllowed={havePermissions('/lista-de-movimientos')} redirectTo='/401' >
                <TransferList />
              </ProtectedRoutes>
            } />
            {/* reports */}
            <Route path='/estadisticas' element={
              <ProtectedRoutes isAllowed={havePermissions('/estadisticas')} redirectTo='/401' >
                <Stats />
              </ProtectedRoutes>
            } />
            <Route path='/reportes' element={
              <ProtectedRoutes isAllowed={havePermissions('/reportes')} redirectTo='/401' >
                <Reports />
              </ProtectedRoutes>
            } />
            {/* management */}
            <Route path='/registro' element={
              <ProtectedRoutes isAllowed={havePermissions('/registro')} redirectTo='/401' >
                <Register />
              </ProtectedRoutes>
            } />
            <Route path='/usuarios' element={
              <ProtectedRoutes isAllowed={havePermissions('/usuarios')} redirectTo='/401' >
                <Employees />
              </ProtectedRoutes>
            } />
            <Route path='/restaurar' element={
              <ProtectedRoutes isAllowed={havePermissions('/restaurar')} redirectTo='/401' >
                <Backup />
              </ProtectedRoutes>
            } />
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