import API from './Api';

const URL = 'auth/';
const header = (token) => ({ headers: { Authorization: `JWT ${token}` } });

export const getUser = (token) => {
    return (
        API.get(URL, header(token))
            .then(response => {
                console.log(response.data)
                return response.data;
            })
    )
}

export const getUserById = (id, token) => {
    return (
        API.get(URL + id, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateUserById = (id, email, nombre, apellido, fk_perfil, fk_empresa, fk_theme, token) => {
    return (
        API.put(URL + id, { email, nombre, apellido, fk_perfil, fk_empresa, fk_theme }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const deleteUserById = (id, token) => {
    return (
        API.delete(URL + id, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const getUserByEmail = (email, token) => {
    return (
        API.get(URL + 'findUserEmail/' + email, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const registerUser = (email, password, nombre, apellido, fk_perfil, fk_empresa, token) => {
    return (
        API.post(URL + 'register', { email, password, nombre, apellido, fk_perfil, fk_empresa }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const loginUser = (email, password) => {
    return (
        API.post(URL + 'login', { email, password })
            .then(response => {
                return response.data;
            })
    )
}

export const forgotPassword = (email) => {
    return (
        API.post(URL + 'forgotPassword', { email })
            .then(response => {
                return response.data;
            })
    )
}

export const resetPassword = (token) => {
    return (
        API.get(URL + 'reset/' + token)
            .then(response => {
                return response.data;
            })
    )
}

export const validateAccount = (token) => {
    return (
        API.get(URL + 'validateAccount/' + token)
            .then(response => {
                return response.data;
            })
    )
}

export const updatePasswordByEmail = (email, password, token) => {
    return (
        API.put(URL + 'updatePasswordviaEmail', { email: email, password: password, resetPasswordToken: token })
            .then(response => {
                return response.data;
            })
    )
}

export const updatePassword = (email, password, token) => {
    return (
        API.put(URL + 'updatePassword', { email, password }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const restoreUser = (id, token) => {
    return (
        API.post(URL + 'restore/' + id, header(token))
            .then(response => {
                return response.data;
            })
    )
}
