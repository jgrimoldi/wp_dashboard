import API, { header, URL_STORAGE } from './Api';

export const insertWarehouses = (nombre, detalle, token) => {
    return (
        API.post(URL_STORAGE, { nombre, detalle }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateWarehousesById = (id, nombre, detalle, token) => {
    return (
        API.put(URL_STORAGE + id, { nombre, detalle }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const getWarehouseByName = (nombre, token) => {
    return (
        API.put(URL_STORAGE + 'qnombre/' + nombre, header(token))
            .then(response => {
                return response.data;
            })
    )
}
