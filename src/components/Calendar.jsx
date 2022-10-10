import React from 'react'

const Calendar = () => {
    const today = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const format = (hour) => hour < 10 ? `0${hour}` : hour

    const date = format(today.getDate());
    const month = months[today.getMonth()];

    return (
        <div className='flex flex-col items-center justify-between gap-2 rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white group-hover:hidden'>
            <span className='text-xs'>Fecha de hoy</span>
            <div className='flex flex-col'>
                <span className='text-6xl'>{date}</span>
                <span className='text-xl'>{month}</span>
            </div>
        </div>
    )
}

export default Calendar