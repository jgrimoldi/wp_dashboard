import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';

import { useStateContext } from '../contexts/ContextProvider';
import { useAuthContext } from '../contexts/ContextAuth';
const HomeNavigation = () => {
    const { auth } = useAuthContext();
    const { activeMenu } = useStateContext();

    const formatDate = (dateToFormat) => {
        const fullDate = new Date(dateToFormat);
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const formatDate = (date) => date < 10 ? `0${date}` : date

        const year = formatDate(fullDate.getFullYear());
        const month = months[fullDate.getMonth()];
        const date = formatDate(fullDate.getDate());
        const hours = formatDate(fullDate.getHours());
        const seconds = formatDate(fullDate.getMinutes());

        return (<>{date} de {month} de {year} - {hours}:{seconds} h</>);
    };

    const lastLogin = !!auth.user.lastlogin ? formatDate(auth.user.lastlogin) : 'Nunca'

    return (
        <div className='flex relative dark:bg-main-dark-bg'>
            {activeMenu ? (
                <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-20'>
                    <Sidebar />
                </div>
            ) : (
                <div className='w-0 dark:bg-secondary-dark-bg'>
                    <Sidebar />
                </div>
            )}

            <div className={`dark:bg-main-bg bg-main-bg min-h-screen w-full z-10 ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
                <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                    <Header />
                </div>

                <div>
                    <Outlet />
                </div>

                <div>
                    <div className='flex justify-end p-2 md:mx-6 relative text-gray-400'>
                        <span className='mr-2'>Último inicio:</span>{lastLogin}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeNavigation