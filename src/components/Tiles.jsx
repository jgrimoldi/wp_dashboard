import React from 'react'
import { BsPlus } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const Tiles = ({ title, data = [], text, to }) => {
    return (
        <div className='flex flex-col gap-2 items-center justify-between rounded-lg py-5 px-4 bg-gradient-to-br from-[#161ECF] to-[#571CDD] text-white group-hover:hidden'>
            <span className='capitalize text-xs'>{title} totales</span>
            <span className='text-5xl'>{data.length}</span>
            <NavLink to={to} className='border-t border-opacity-70 flex items-center opacity-70 text-14 pt-2 hover:opacity-100'><span className='text-xl'><BsPlus /></span>Agregar nuevo {text}</NavLink>
        </div>
    )
}

export default Tiles