import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const ContextAuth = ({ children }) => {
    const [auth, setAuth] = useState({ token: '', user: {} });

    const handleErrors = (error) => {
        const getError = error.response.data.error;
        if (getError === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser')
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, handleErrors }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

