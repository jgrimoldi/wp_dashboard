import React, { useEffect, useState } from 'react';

const Clock = () => {
    const [today, setDate] = useState(new Date());
    const format = (hour) => hour < 10 ? `0${hour}` : hour

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => { clearInterval(timer); }
    });


    const hour = format(today.getHours());
    const mins = format(today.getMinutes());
    const secs = format(today.getSeconds());

    const wish = `${(hour > 5 && hour < 12 && 'Buen día') || (hour > 12 && hour < 19 && 'Buenas tardes') || 'Buenas noches'}`;

    return (
        <div className='min-w-fit w-full flex-1 sm:w-1/3 h-36 flex flex-col gap-2 items-center justify-center rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white group-hover:hidden'>
            <p className='self-start text-xs'>{wish}</p>
            <div className='h-fit flex items-center justify-end gap-2 font-[monospace]'>
                <p className='text-5xl'>{hour}</p>:<p className='text-5xl'>{mins}</p><p className='text-x self-end'>: {secs}</p>
            </div>
        </div>
    )
}

export default Clock