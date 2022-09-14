import React, { useEffect } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Add, Delete } from '.';

import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunction, color, icon }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button type='button' onClick={customFunction} style={{ color }} className='relative text-xl rounded-full p-3 hover:bg-light-gray'>
      {icon}
    </button>
  </TooltipComponent>
)

const Header = () => {

  const { setActiveMenu, isClicked, screenSize, setScreenSize, handleClick } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className='flex justify-between p-2 md:mx-6 relative'>
      <NavButton title="Menu" customFunction={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} color="blue" ></NavButton>
      <div className='flex'>
        <div className='flex items-center gap-2 cursor-pointer p-1'>
          <h1 className='font-bold text-14'>Dashboard</h1>
        </div>
        <NavButton title="Agregar" customFunction={() => handleClick('add')} color="blue" ></NavButton>
        <NavButton title="Eliminar" customFunction={() => handleClick('delete')} color="blue" ></NavButton>
        {isClicked.add && <Add />}
        {isClicked.delete && <Delete />}
      </div>
    </div>
  )
}

export default Header