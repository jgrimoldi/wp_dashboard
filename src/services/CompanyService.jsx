import API, { header, URL_COMPANY } from './Api';

export const insertCompany = (nombre, descripcion, token) => {
    return (
        API.post(URL_COMPANY, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateCompanyById = (id, nombre, descripcion, token) => {
    return (
        API.put(URL_COMPANY + id, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}