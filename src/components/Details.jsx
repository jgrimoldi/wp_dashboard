import React from 'react'

const Details = ({ setOpen, incomeID }) => {

    console.log(incomeID)

    return (
        <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
            <div className='h-screen flex items-center justify-center'>
                <div className='flex flex-col item gap-5 bg-white w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
                    <div>Detalle de compra</div>
                    <button onClick={() => { setOpen(false) }} >Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default Details