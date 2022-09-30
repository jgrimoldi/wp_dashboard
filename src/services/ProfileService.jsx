import API, { header, URL_PROFILE } from './Api';

export const insertRole = (nom_perfil, token) => {
    return (
        API.post(URL_PROFILE, { nom_perfil }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateRoleById = (id, nom_perfil, token) => {
    return (
        API.put(URL_PROFILE + id, { nom_perfil }, header(token))
            .then(response => {
                return response.data;
            })
    )
}