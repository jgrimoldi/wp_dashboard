import React, { useEffect } from 'react';
import { BsList } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunction, color, icon }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button type='button' onClick={customFunction} style={{ color }} className='relative text-2xl rounded-full p-3 hover:bg-light-gray dark:hover:bg-black'>
      {icon}
    </button>
  </TooltipComponent>
)

const Header = () => {

  const { setActiveMenu, screenSize, setScreenSize, themeColors } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 1000) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  return (
    <div className='flex justify-between p-2 md:mx-6 relative'>
      <NavButton title="Menu" customFunction={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} color={themeColors.primary} icon={<BsList />} ></NavButton>
      <div className='flex items-center gap-2 cursor-pointer p-1'>
        <h1 className='text-2xl font-extrabold'>AG Stock</h1>
      </div>
      <div className='flex'>
      </div>
    </div>
  )
}

export default Header