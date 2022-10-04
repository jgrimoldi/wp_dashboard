import API, { header, URL_BACKUP } from './Api';

export const createBackup = (id, token) => {
    return (
        API.post(URL_BACKUP, { id }, header(token))
            .then(response => {
                return response.data;
            })
    )
}