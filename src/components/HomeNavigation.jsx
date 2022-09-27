import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const HomeNavigation = () => {

    const { activeMenu } = useStateContext();

    return (
        <div className='flex relative dark:bg-main-dark-bg'>
            {activeMenu ? (
                <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                    <Sidebar />
                </div>
            ) : (
                <div className='w-0 dark:bg-secondary-dark-bg'>
                    <Sidebar />
                </div>
            )}

            <div className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`}>
                <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                    <Header />
                </div>

                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default HomeNavigation