import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { themeColors } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const ThemeSettings = () => {

  const { currentColor, setMode } = useStateContext();

  return (
    <div key='Temas'>
      <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">Temas</p>
      <div className='flex flex-wrap items-center gap-5 pl-4 pt-3 pb-2.5 text-md text-gray-700 dark:text-gray-200 m-2'>
        {themeColors.map((item, index) => (
          <TooltipComponent key={index} content={item.name} position='BottomCenter'>
            <div>
              <button type='button' className='border border-black dark:border-white h-10 w-10 rounded-full cursor-pointer' style={{ backgroundColor: item.hex }} onClick={() => { setMode(item.mode, item.colors) }}>
                <BsCheck className={`ml-2 text-2xl text-${item.secondary} ${currentColor === item.hex ? 'block' : 'hidden'}`} />
              </button>
            </div>
          </TooltipComponent>
        ))}
      </div>
    </div>
  )
}

export default ThemeSettings