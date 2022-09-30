import API, { header } from './Api';

export const getDataFrom = async (URL, token) => {
    return API.get(URL, header(token))
        .then(response => { return response.data; })
        .catch(error => { throw error.response; })
}

export const getDataByIdFrom = async (URL, id, token) => {
    return API.get(URL + id, header(token))
        .then(response => { return response.data; })
        .catch(error => { throw error.response; })
}

export const deleteDataByIdFrom = async (URL, id, token) => {
    return API.delete(URL + id, header(token))
        .then(response => { return response.data; })
        .catch(error => { throw error.response; })
}

export const restoreDataByIdFrom = async (URL, id, token) => {
    return API.post(URL + 'restore/' + id, header(token))
        .then(response => { return response.data; })
        .catch(error => { throw error.response; })
}