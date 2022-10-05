import API, { header } from './Api';

export const getDataFrom = (URL, signal, token) => {
    return (
        API.get(URL, header(token), { signal: signal })
            .then(response => {
                return (response.data)
            })
    )
}

export const getDataByIdFrom = (URL, id, token) => {
    return (
        API.get(URL + id, header(token))
            .then(response => {
                return (response.data)
            })
    )
}

export const deleteDataByIdFrom = (URL, id, token) => {
    return (
        API.delete(URL + id, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const restoreDataByIdFrom = (URL, id, token) => {
    return (
        API.post(URL + 'restore/' + id, header(token))
            .then(response => {
                return response.data;
            })
    )
}