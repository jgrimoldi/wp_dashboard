import axios from "axios";

export default axios.create({ baseURL: `http://stock.agsistemas.net.ar:3001/api/` });

export const header = (token) => ({ headers: { Authorization: `JWT ${token}` } });

export const URL_DASHBOARD = 'dashboard/';
export const URL_STORAGE = 'almacen/';
export const URL_WAREHOUSE = 'almacenestablecimiento/';
export const URL_WAREHOUSEPRODUCT = 'almacenproducto/';
export const URL_AUTH = 'auth/';
export const URL_BACKUP = 'backup/';
export const URL_CATEGORY = 'categoriaProveedor/';
export const URL_CLIENT = 'cliente/';
export const URL_BARCODE = 'codigobarra/';
export const URL_INCOME = 'compraproducto/';
export const URL_EXPENSES = 'egresoproducto/';
export const URL_TRANSFER = 'movimiento/';
export const URL_COMPANY = 'empresa/';
export const URL_COMPANYMODULE = 'empresaModulo/';
export const URL_ESTABLISHMENT = 'establecimiento/';
export const URL_VAT = 'iva/';
export const URL_MODULE = 'modulo/';
export const URL_SN = 'numeroserie/';
export const URL_PROFILE = 'perfil/';
export const URL_PERMISSION = 'permiso/';
export const URL_PRODUCT = 'producto/';
export const URL_VENDOR = 'productoproveedor/';
export const URL_SUPPLIER = 'proveedor/';
export const URL_ROLE = 'rol/';
export const URL_THEME = 'theme/';
export const URL_PRODUCTTYPE = 'tipoproducto/';
export const URL_UNIT = 'unidadmedida/';
