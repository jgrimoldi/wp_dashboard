import API, { header, URL_INCOME, URL_EXPENSES, URL_TRANSFER } from './Api';

export const insertNewIncome = (compra, detalle, detnumeroserie, token) => {
    return (
        API.post(URL_INCOME, { compra, detalle, detnumeroserie }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertNewExpense = (egreso, detalle, detnumeroserie, token) => {
    return (
        API.post(URL_EXPENSES, { egreso, detalle, detnumeroserie }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertNewTransfer = (movalmacen, detalle, detnumeroserie, token) => {
    return (
        API.post(URL_TRANSFER, { movalmacen, detalle, detnumeroserie }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertRMA = (devolucion, detalle, detnumeroserie, token) => {
    return (
        API.post(URL_TRANSFER, { devolucion, detalle, detnumeroserie }, header(token))
            .then(response => {
                return response.data;
            })
    )
}