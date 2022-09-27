import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const HomeTemplate = () => {
    return (
        <div className='flex relative dark:bg-main-dark-bg'>
            <div className='dark:bg-main-bg bg-main-bg min-h-screen w-full flex-2'>
                <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                    <Navbar />
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default HomeTemplate