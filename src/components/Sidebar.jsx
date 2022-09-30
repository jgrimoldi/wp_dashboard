import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { BsArrowLeftSquare, BsBoxArrowLeft } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { ThemeSettings } from '.';
import avatar from '../data/avatar.png';
import { sidebar } from '../data/dummy.js';
import { getDataByIdFrom } from '../services/GdrService';
import { URL_PROFILE, URL_COMPANY } from '../services/Api';
import { useStateContext } from '../contexts/ContextProvider';
import { useAuthContext } from '../contexts/ContextAuth';

const Sidebar = () => {

  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const { auth, setAuth } = useAuthContext();
  const userData = auth.user;
  const [user, setUser] = useState({});
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {

    const fetchUser = async () => {
      const name = userData.nombre + ' ' + userData.apellido;
      const fetchProfile = await getDataByIdFrom(URL_PROFILE, userData.fk_perfil, auth.token);
      const fetchCompany = await getDataByIdFrom(URL_COMPANY, userData.fk_empresa, auth.token);
      setUser({ ...user, name: name, profile: fetchProfile, company: fetchCompany });
      setIsMounted(true);
    }

    if (isMounted === false) {
      fetchUser();
    }

  })

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  }

  const handleLogout = () => setAuth({});

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  console.log(user);

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
        <div className='flex justify-between items-center'>
          <Link to='/perfil' onClick={handleCloseSidebar} className='items-center gap-3 ml-3 mt-4 flex text-14 tracking-tight dark:text-white text-slate-900'>
            <div className="flex items-center gap-2 cursor-pointer" >
              <img className="rounded-full w-10 h-10" src={avatar} alt="user-profile" />
              <div>
                <p>
                  <span className="font-extrabold text-14">{user.name}</span>{' - '}
                  <span className="text-gray-400 text-14">{user.profile}</span>
                </p>
                <p className='text-gray-400 text-14'>
                  {user.company}
                </p>
              </div>
            </div>
          </Link>
          <TooltipComponent content='Menu' position='BottomCenter'>
            <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'>
              <BsArrowLeftSquare />
            </button>
          </TooltipComponent>
        </div>

        <div className="mt-5 ">
          {sidebar.map((item) => (
            <div key={item.title}>
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                {item.title}
              </p>
              {item.links.map((link) => (
                <NavLink
                  to={`/${link.url}`}
                  key={link.url}
                  onClick={handleCloseSidebar}
                  style={({ isActive }) => ({ backgroundColor: isActive ? 'blue' : '', })}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  {link.icon}
                  <span className="capitalize ">{link.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
          <NavLink
            to='/inicio'
            key='logout'
            onClick={handleLogout}
            style={({ isActive }) => ({ backgroundColor: isActive ? 'blue' : '', })}
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <BsBoxArrowLeft />
            <span className="capitalize ">Cerrar Sesión</span>
          </NavLink>
          <ThemeSettings />
        </div>
      </>)}
    </div>
  )
}

export default Sidebar;