import React from 'react'

const Calendar = () => {
    const today = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const format = (hour) => hour < 10 ? `0${hour}` : hour

    const date = format(today.getDate());
    const month = months[today.getMonth()];

    return (
        <div className='min-w-fit w-full flex-1 sm:w-1/3 h-36 flex flex-col items-center justify-between gap-2 rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white group-hover:hidden'>
            <p className='text-xs'>Fecha de hoy</p>
            <div className='flex flex-col'>
                <p className='text-6xl'>{date}</p>
                <p className='text-xl'>{month}</p>
            </div>
        </div>
    )
}

export default Calendar