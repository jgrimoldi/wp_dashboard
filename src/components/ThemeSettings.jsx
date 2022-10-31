import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { themeColorsSetter } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { updateUserById } from '../services/AuthService';
import { useAuthContext } from '../contexts/ContextAuth';

const ThemeSettings = () => {
  const { auth, setAuth, handleErrors } = useAuthContext();
  const { currentColor, setMode } = useStateContext();

  const updateObject = (new_fk_theme) => {
    const userUpdated = { ...auth.user, fk_theme: new_fk_theme };
    setAuth({ ...auth, user: userUpdated });
    localStorage.setItem('_fDataUser', JSON.stringify({ ...auth, user: userUpdated }));
  }

  const changeTheme = async (mode, fk_theme) => {
    setMode(mode);
    await updateUserById(auth.user.id, auth.user.email, auth.user.nombre, auth.user.apellido, auth.user.fk_perfil, auth.user.fk_empresa, Number(fk_theme), auth.token)
      .then(() => updateObject(Number(fk_theme)))
      .catch(error => handleErrors(error))
  }

  return (
    <div key='Temas'>
      <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">Temas</p>
      <div className='flex flex-wrap items-center gap-5 pl-4 pt-3 pb-2.5 text-md text-gray-700 dark:text-gray-200 m-2'>
        {themeColorsSetter.map((item, index) => (
          <TooltipComponent key={index} content={item.name} position='BottomCenter'>
            <div>
              <button type='button' className='border border-black dark:border-white h-10 w-10 rounded-full cursor-pointer' style={{ backgroundColor: item.hex }} onClick={() => changeTheme(item.mode, item.fk_theme)}>
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