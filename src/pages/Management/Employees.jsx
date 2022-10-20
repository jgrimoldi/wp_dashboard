import React, { useEffect, useState } from 'react';

import { SEO, Title, Table } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { employeesGrid } from '../../data/dummy';
import { URL_AUTH } from '../../services/Api';
import { getDataFrom } from '../../services/GdrService';

const Employees = () => {
    const { auth, handleErrors } = useAuthContext()
    const [employeesData, setEmployeesData] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const getEmployees = async () => {
            await getDataFrom(URL_AUTH, signal, auth.token)
                .then(response => setEmployeesData(response.data))
                .catch(error => handleErrors(error))
        }
        getEmployees();
        return () => { controller.abort(); };
    }, [auth, handleErrors])

    const sortByLastCreated = (data, anotherData) => new Date(anotherData.createdAt) < new Date(data.createdAt) ? -1 : 1

    return (
        <>
            <SEO title='Empleados' />
            <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
                <Title category="Mis" title="Empleados" />
                <Table header={employeesGrid} data={employeesData.filter(user => user.id !== auth.user.id && user.fk_perfil !== 3)} filterTitle='Mis Empleados' checkbox={true} sortFunction={sortByLastCreated} />
            </div>
        </>
    )
}

export default Employees