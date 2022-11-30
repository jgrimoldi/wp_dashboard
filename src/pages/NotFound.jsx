import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import notFound from '../data/notFound.svg';
import { Button, SEO } from '../components';

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    return (
        <>
            <SEO title='Página no encontrada' />
            <div className='hidden lg:block absolute w-1/2 h-fit m-auto top-0 bottom-0 z-0'>
                <img className='h-3/4 m-auto' src={notFound} alt='No se encontro la página' />
            </div>
            <div className='relative w-full h-screen flex items-center justify-center'>
                <div className='text-center z-50'>
                    <span className='text-lg font-bold'>Página no encontrada</span>
                    <h1 className='text-[256px] font-[monospace] font-bold leading-none'>404</h1>
                    <Button customFunction={() => navigate(from, { replace: true })} borderColor='#161ECF' color='#FFFFFF' backgroundColor='#161ECF' width='full' text='Volver al inicio' />
                </div>
                <div className='absolute self-end justify-self-start p-4 text-slate-400'>
                    <a href="https://www.freepik.com/free-vector/empty-concept-illustration_7117861.htm#query=empty&position=2&from_view=keyword">Image by storyset</a> on Freepik
                </div>
            </div>
        </>
    )
}

export default NotFound