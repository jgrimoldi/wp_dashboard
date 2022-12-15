import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { BsArrowLeftSquare, BsBoxArrowLeft } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { LoadingSpinner, ThemeSettings } from '.';
import avatar from '../data/avatar.png';
import { sidebar } from '../data/dummy.js';
import { getDataByIdFrom, getDataFrom } from '../services/GdrService';
import { URL_PROFILE, URL_COMPANY, URL_PERMISSION, URL_ROLE } from '../services/Api';
import { useStateContext } from '../contexts/ContextProvider';
import { useAuthContext } from '../contexts/ContextAuth';

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, themeColors, setMode } = useStateContext();
  const { auth, setAuth } = useAuthContext();
  const [fullName, setFullName] = useState({ name: '', surname: '' });
  const [profile, setProfile] = useState('');
  const [company, setCompany] = useState({ data: {}, user: {} });
  const [isMounted, setIsMounted] = useState(false);
  const [themeOnScreen, setThemeOnScreen] = useState(null);
  const [allowedPages, setAllowedPages] = useState({});

  useEffect(() => {
    const themes = { 1: 'light', 2: 'dark' };
    const userThemeMode = themes[auth?.user?.fk_theme];
    return () => {
      if (themeOnScreen !== true) {
        setMode(userThemeMode);
        setThemeOnScreen(true);
      }
    }
  })

  useEffect(() => {
    if (!auth.token && localStorage.getItem('_fDataUser') !== null) {
      setAuth(JSON.parse(localStorage.getItem('_fDataUser')));
    }

    const getDataById = async (URL, ID, setState) => {
      await getDataByIdFrom(URL, ID, auth.token)
        .then(response => {
          setState(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setMode('light');
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    };

    if (isMounted === false && !!auth.token) {
      getDataById(URL_PROFILE, auth.user.fk_perfil, setProfile);
      getDataById(URL_COMPANY, auth.user.fk_empresa, setCompany);
      setFullName((prevFullName) => { return { ...prevFullName, name: auth.user.nombre, surname: auth.user.apellido } })
      setIsMounted(true);
    }
  }, [auth, setAuth, isMounted, setMode])

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getRecords = () => {
      const user = JSON.parse(localStorage.getItem('_fDataUser'))

      getDataFrom(URL_PERMISSION, signal, user?.token)
        .then(response => {
          Promise.all(response.data.map(permissionID =>
            getDataByIdFrom(URL_ROLE + user?.user?.fk_perfil + '/', permissionID.id, user.token)
              .then(response => setAllowedPages((prevState) => { return { ...prevState, [permissionID.nom_permiso]: response.data?.habilitado } }))
          ));
        })
    }

    getRecords();
    return () => { controller.abort(); };

  }, [])

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 1000) {
      setActiveMenu(false);
    }
  }

  const handleLogout = () => {
    setMode('light');
    setAuth({});
    localStorage.removeItem('_fDataUser');
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const disabledLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-gray-400 text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {Object.keys(allowedPages).length === 0 && <LoadingSpinner color={themeColors?.primary} />}
      {activeMenu && (<>
        <div className='flex justify-between items-center'>
          <Link to='/perfil' onClick={handleCloseSidebar} className='items-center gap-3 ml-3 mt-4 flex text-14 tracking-tight dark:text-white text-slate-900'>
            <div className="flex items-center gap-2 cursor-pointer" >
              <img className="rounded-full w-10 h-10" src={avatar} alt="user-profile" />
              <div>
                <p>
                  <span className="font-extrabold text-14">{fullName.name + ' ' + fullName.surname}</span>{' - '}
                  <span className="text-gray-400 text-14 capitalize">{profile.nom_perfil}</span>
                </p>
                <p className='text-gray-400 text-14'>{company.razonsocial}</p>
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
              {Object.keys(allowedPages).length !== 0 && item.links.map((link) => (
                <NavLink
                  to={allowedPages[`/${link.url}`] ? `/${link.url}` : '/401'}
                  key={link.name} // link.url
                  onClick={handleCloseSidebar}
                  style={({ isActive }) => ({ backgroundColor: link.url === '/' || !isActive || !allowedPages[`/${link.url}`] ? '' : themeColors?.primary, })}
                  className={({ isActive }) => (link.url === '/' || !allowedPages[`/${link.url}`] ? disabledLink : isActive ? activeLink : normalLink)}
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
            style={({ isActive }) => ({ backgroundColor: isActive ? themeColors?.primary : '', })}
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