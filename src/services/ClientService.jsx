import API, { header, URL_CLIENT } from './Api';

export const insertClient = (id, nombre, direccion, cp, tel, email, observaciones, token) => {
    return (
        API.post(URL_CLIENT, { id, nombre, direccion, cp, tel, email, observaciones }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateClientById = (id, nombre, direccion, cp, tel, email, observaciones, token) => {
    return (
        API.put(URL_CLIENT + id, { nombre, direccion, cp, tel, email, observaciones }, header(token))
            .then(response => {
                return response.data;
            })
    )
}
