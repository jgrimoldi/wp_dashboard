import API, { header, URL_SUPPLIER, URL_CATEGORY } from './Api';

export const insertSupplier = (id, fk_categoria, nombre, direccion, cp, tel, email, observaciones, token) => {
    return (
        API.post(URL_SUPPLIER, { id, fk_categoria, nombre, direccion, cp, tel, email, observaciones }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateSupplierById = (id, fk_categoria, nombre, direccion, cp, tel, email, observaciones, token) => {
    return (
        API.put(URL_SUPPLIER + id, { fk_categoria, nombre, direccion, cp, tel, email, observaciones }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertCategory = (nombre, descripcion, token) => {
    return (
        API.post(URL_CATEGORY, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateCategory = (id, nombre, descripcion, token) => {
    return (
        API.put(URL_CATEGORY + id, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}