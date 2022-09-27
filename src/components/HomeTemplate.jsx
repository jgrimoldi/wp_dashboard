import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useStateContext } from '../contexts/ContextProvider';
import { Navbar, NavbarMobile } from '.';

const HomeTemplate = () => {
    const { activeNavbar, setActiveNavbar, screenSize, setScreenSize, } = useStateContext();

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    });

    useEffect(() => {
        if (screenSize <= 990) {
            setActiveNavbar(false);
        } else {
            setActiveNavbar(true);
        }
    }, [screenSize, setActiveNavbar]);

    return (
        <div className='flex relative dark:bg-main-dark-bg'>
            <div className='dark:bg-main-bg bg-main-bg min-h-screen w-full flex-2'>
                <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                    {
                        activeNavbar
                            ?
                            <Navbar />
                            :
                            <NavbarMobile />
                    }
                </div>
                
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default HomeTemplate