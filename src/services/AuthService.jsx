import API, { header, URL_AUTH } from './Api';

export const updateUserById = (id, email, nombre, apellido, fk_perfil, fk_empresa, fk_theme = 1, token) => {
    return (
        API.put(URL_AUTH + id, { email, nombre, apellido, fk_perfil, fk_empresa, fk_theme }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const getUserByEmail = (email, token) => {
    return (
        API.get(URL_AUTH + 'findUserEmail/' + email, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const registerUser = (email, password, nombre, apellido, fk_perfil, fk_empresa, fk_theme = 1, token) => {
    return (
        API.post(URL_AUTH + 'register', { email, password, nombre, apellido, fk_perfil, fk_empresa, fk_theme }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const loginUser = (email, password) => {
    return (
        API.post(URL_AUTH + 'login', { email, password })
            .then(response => {
                return response.data;
            })
    )
}

export const forgotPassword = (email) => {
    return (
        API.post(URL_AUTH + 'forgotPassword', { email })
            .then(response => {
                return response.data;
            })
    )
}

export const resetPassword = (token) => {
    return (
        API.get(URL_AUTH + 'reset/' + token)
            .then(response => {
                return response.data;
            })
    )
}

export const reSendValidation = (email, token) => {
    return (
        API.post(URL_AUTH + 'validateAccountResend', { email }, header(token))
            .then(response => response.data)
    )
}

export const validateAccount = (token) => {
    return (
        API.get(URL_AUTH + 'validateAccount/' + token)
            .then(response => {
                return response.data;
            })
    )
}

export const updatePasswordByEmail = (email, password, token) => {
    return (
        API.put(URL_AUTH + 'updatePasswordviaEmail', { email, password, resetPasswordToken: token })
            .then(response => {
                return response.data;
            })
    )
}

export const updatePassword = (email, passwordOld, password, token) => {
    return (
        API.put(URL_AUTH + 'updatePassword', { email, passwordOld, password }, header(token))
            .then(response => {
                return response.data;
            })
    )
}