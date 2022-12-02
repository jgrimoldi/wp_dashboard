import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';

import { useStateContext } from '../contexts/ContextProvider';
const HomeNavigation = () => {
    const { activeMenu, currentMode } = useStateContext();
    return (
        <div className={currentMode}>
            <div className='flex relative dark:bg-main-dark-bg'>
                {activeMenu ? (
                    <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-10'>
                        <Sidebar />
                    </div>
                ) : (
                    <div className='w-0 dark:bg-secondary-dark-bg'>
                        <Sidebar />
                    </div>
                )}

                <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full z-10 ${activeMenu ? 'md:ml-72' : 'flex-1'}`}>
                    <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                        <Header />
                    </div>

                    <div className='z-30'>
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomeNavigation