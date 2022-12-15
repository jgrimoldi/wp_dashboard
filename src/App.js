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
  const isPermitted = isAllowed

  function havePermissions(aProperty) {
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
            <Route path='/dashboard' element={
              <ProtectedRoutes isAllowed={havePermissions('/dashboard')} redirectTo='/401' >
                <Dashboard />
              </ProtectedRoutes>
            } />
            <Route path='/almacen' element={
              <ProtectedRoutes isAllowed={havePermissions('/almacen')} redirectTo='/401' >
                <Storage />
              </ProtectedRoutes>
            } />
            <Route path='/clientes' element={
              <ProtectedRoutes isAllowed={havePermissions('/clientes')} redirectTo='/401' >
                <Clients />
              </ProtectedRoutes>
            } />
            {/* products */}
            <Route path='/productos' element={
              <ProtectedRoutes isAllowed={havePermissions('/productos')} redirectTo='/401' >
                <Products />
              </ProtectedRoutes>
            } />
            <Route path='/tipo-de-productos' element={
              <ProtectedRoutes isAllowed={havePermissions('/tipo-de-productos')} redirectTo='/401' >
                <ProductType />
              </ProtectedRoutes>
            } />
            <Route path='/unidades-de-medida' element={
              <ProtectedRoutes isAllowed={havePermissions('/unidades-de-medida')} redirectTo='/401' >
                <Units />
              </ProtectedRoutes>
            } />
            {/* suppliers */}
            <Route path='/proveedores' element={
              <ProtectedRoutes isAllowed={havePermissions('/proveedores')} redirectTo='/401' >
                <Providers />
              </ProtectedRoutes>
            } />
            <Route path='/categoria-de-proveedores' element={
              <ProtectedRoutes isAllowed={havePermissions('/categoria-de-proveedores')} redirectTo='/401' >
                <Category />
              </ProtectedRoutes>
            } />
            {/* moves */}
            <Route path='/ingresos' element={
              <ProtectedRoutes isAllowed={havePermissions('/ingresos')} redirectTo='/401' >
                <Income />
              </ProtectedRoutes>
            } />
            <Route path='/egresos' element={
              <ProtectedRoutes isAllowed={havePermissions('/egresos')} redirectTo='/401' >
                <Expenses />
              </ProtectedRoutes>
            } />
            <Route path='/transferencia-entre-almacenes' element={
              <ProtectedRoutes isAllowed={havePermissions('/transferencia-entre-almacenes')} redirectTo='/401' >
                <Transfer />
              </ProtectedRoutes>
            } />
            <Route path='/devolucion-productos' element={
              <ProtectedRoutes isAllowed={havePermissions('/devolucion-productos')} redirectTo='/401' >
                <RMA />
              </ProtectedRoutes>
            } />
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
            <Route path='/perfil' element={
              <ProtectedRoutes isAllowed={havePermissions('/perfil')} redirectTo='/401' >
                <Settings />
              </ProtectedRoutes>
            } />
            <Route path='/ayuda' element={
              <ProtectedRoutes isAllowed={havePermissions('/ayuda')} redirectTo='/401' >
                <Help />
              </ProtectedRoutes>
            } />
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