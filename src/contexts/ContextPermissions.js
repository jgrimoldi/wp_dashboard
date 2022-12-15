import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { URL_PERMISSION, URL_ROLE } from '../services/Api';
import { getDataFrom, getDataByIdFrom } from '../services/GdrService';
import { useAuthContext } from './ContextAuth';

const PermissionsContext = createContext();

export const ContextPermissions = ({ children }) => {
    const { auth } = useAuthContext()
    const [allowedPages, setAllowedPages] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function getAllowedPages(anArray) {
            const allowedPages = {};
            await Promise.all(anArray.map(permissionID =>
                getDataByIdFrom(URL_ROLE + auth?.user?.fk_perfil + '/', permissionID.id, auth.token)
                    .then(response => Object.assign(allowedPages, { [permissionID.nom_permiso]: response.data.habilitado }))
            ));
            return allowedPages;
        }

        const getRecords = async () => {
            await getDataFrom(URL_PERMISSION, signal, auth.token)
                .then(async response => setAllowedPages(await getAllowedPages(response.data)))
        }

        if (!!auth.token)
            getRecords();

        return () => { controller.abort(); };
    }, [auth])

    return (
        <PermissionsContext.Provider value={{ allowedPages }}>
            {children}
        </PermissionsContext.Provider>
    )
}

export const usePermissionsContext = () => useContext(PermissionsContext);


