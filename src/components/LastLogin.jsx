import React from 'react'

const LastLogin = ({ lastLogin }) => {

    const formatDate = (dateToFormat) => {
        let fullDate = new Date(dateToFormat);
        fullDate = new Date(fullDate.getTime() + 3 * 60 * 60 * 1000);
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const formatDate = (date) => date < 10 ? `0${date}` : date

        const year = formatDate(fullDate.getFullYear());
        const month = months[fullDate.getMonth()];
        const date = formatDate(fullDate.getDate());
        const hours = formatDate(fullDate.getHours());
        const seconds = formatDate(fullDate.getMinutes());

        return (<>{date} de {month} de {year} - {hours}:{seconds} h</>);
    };

    const date = !!lastLogin ? formatDate(lastLogin) : 'Nunca'

    return (
        <div className=' w-full relative'>
            <div className='flex justify-center sm:justify-end p-2 md:mx-6 relative text-gray-400 text-sm sm:text-base'>
                <span className='mr-2'>Último inicio:</span>{date}
            </div>
        </div>
    )
}

export default LastLogin