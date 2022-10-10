import React, { useEffect, useState } from 'react'

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

    const wish = `${(hour < 12 && 'Buen día') || (hour < 19 && 'Buenas tardes') || 'Buenas noches'}`;

    return (
        <div className='flex flex-col gap-2 items-center justify-center rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white group-hover:hidden'>
            <span className='self-start text-xs'>{wish}</span>
            <div className='h-fit flex items-center justify-end gap-2 font-[monospace]'>
                <span className='text-5xl'>{hour}</span>:<span className='text-5xl'>{mins}</span><span className='text-x self-end'>: {secs}</span>
            </div>
        </div>
    )
}

export default Clock