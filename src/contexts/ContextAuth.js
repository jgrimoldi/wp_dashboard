import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const ContextAuth = ({ children }) => {
    const [auth, setAuth] = useState({ token: '', user: {} });

    return (
        <AuthContext.Provider value={{ auth, setAuth }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

