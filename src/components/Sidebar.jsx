import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { BsArrowLeftSquare } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ThemeSettings } from '.';

import avatar from '../data/avatar.png';
import { sidebar } from '../data/dummy.js';
import { useStateContext } from '../contexts/ContextProvider.js';

const Sidebar = () => {

  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const currentColor = 'blue';

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className='ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
      {activeMenu && (<>
        <div className='flex justify-between items-center'>
          <Link to='/perfil' onClick={handleCloseSidebar} className='items-center gap-3 ml-3 mt-4 flex text-14 tracking-tight dark:text-white text-slate-900'>
            <div className="flex items-center gap-2 cursor-pointer" >
              <img className="rounded-full w-10 h-10" src={avatar} alt="user-profile" />
              <div>
                <p>
                  <span className="font-extrabold text-14">John Doe</span>{' - '}
                  <span className="text-gray-400 text-14">Dev</span>
                </p>
                <p className='text-gray-400 text-14'>
                  Empresa test SA
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
                  style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '', })}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  {link.icon}
                  <span className="capitalize ">{link.name}</span>
                </NavLink>
              ))}
            </div>
          ))}
          <ThemeSettings />
        </div>
      </>)}
    </div>
  )
}

export default Sidebar;