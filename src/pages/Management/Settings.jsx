import React, { useState, useEffect } from 'react';

import avatar from '../../data/avatar.png';
import { SEO, Title, Button, Input, Password, GroupValidator, ErrorLabel } from '../../components';
import { regEx } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';
import { getDataByIdFrom } from '../../services/GdrService';
import { URL_PROFILE, URL_COMPANY } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';

const UpdatePassword = ({ email, setClose }) => {
  const { themeColors } = useStateContext();
  const [oldPassword, setOldPassword] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [passwordVerify, setPasswordVerify] = useState({ value: '', error: null });
  const [errorForm, setErrorForm] = useState({ value: '', error: null });

  const handleValidatePassword = () => {
    if (password.value.length > 0) {
      if (password.value !== passwordVerify.value) {
        setPasswordVerify((prevState) => { return { ...prevState, error: true } })
      } else {
        setPasswordVerify((prevState) => { return { ...prevState, error: false } })
      }
    }
  }

  const handleUpdate = () => {

  }

  return (
    <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
      <div className='h-screen flex items-center justify-center'>
        <div className='flex flex-col item gap-5 bg-white dark:bg-secondary-dark-bg w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
          <div className='self-start text-lg dark:text-slate-100'>Cambiar contraseña </div>
          <form onSubmit={handleUpdate} className='w-full flex flex-col justify-center items-center gap-3'>
            <Password id='oldPassword' label='Contraseña Anterior' color={themeColors?.secondary} state={oldPassword} setState={setOldPassword} regEx={regEx.password} helperText='No es una contraseña válida' css='w-full' />
            <Password id='password' label='Nueva Contraseña' color={themeColors?.secondary} state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' css='w-full' />
            {!!password.value && <GroupValidator password={password.value} />}
            <Password id='passwordVerify' label='Confirmar Nueva Contraseña' color={themeColors?.secondary} state={passwordVerify} setState={setPasswordVerify} customFunction={handleValidatePassword} helperText='Las contraseñas no coinciden' css='w-full' />
            {!!errorForm.value && <ErrorLabel color='red'>{errorForm.value}</ErrorLabel>}
            <div className='w-1/2 flex gap-1'>
              <Button customFunction={() => { setClose(false) }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Cerrar' width='1/2' tabindex='-1' />
              <Button type='submit' borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Actualizar contraseña' width='1/2' />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


const Settings = () => {
  const { themeColors } = useStateContext();
  const { auth, handleErrors } = useAuthContext();
  const [name, setName] = useState({ value: auth.user.nombre, error: null });
  const [surname, setSurname] = useState({ value: auth.user.apellido, error: null });
  const [email, setEmail] = useState({ value: auth.user.email, error: null });
  const [profile, setProfile] = useState({ value: '', error: null });
  const [company, setCompany] = useState({ value: '', error: null });
  const [openPassword, setOpenPassword] = useState(null);

  useEffect(() => {
    const getDataById = async (URL, ID, setState, getter) => {
      await getDataByIdFrom(URL, ID, auth.token)
        .then(response => setState({ value: response.data[getter] }))
        .catch(error => handleErrors(error))
    };

    getDataById(URL_PROFILE, auth.user.fk_perfil, setProfile, 'nom_perfil');
    getDataById(URL_COMPANY, auth.user.fk_empresa, setCompany, 'razonsocial');

  }, [auth, handleErrors])

  const handleSave = () => {

  }

  return (
    <>
      <SEO title='Mi perfil' />
      {openPassword === true && <UpdatePassword email={auth.user.email} setClose={setOpenPassword} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category="Mi" title="Perfil" />
        <div className='flex md:flex-row-reverse flex-col gap-3'>
          <div className='flex flex-col gap-2 p-2 self-start'>
            <p style={{ color: themeColors?.highEmphasis }} className='text-lg'>Imagen de Perfil</p>
            <img className="rounded-full w-52 h-52" src={avatar} alt="user-profile" />
          </div>
          <div className='w-full md:w-4/5 flex flex-col gap-5 m-auto p-2'>
            <Input id='name' label='Nombre' state={name} setState={setName} regEx={regEx.text} helperText='No es un nombre válido' />
            <Input id='surname' label='Apellido' state={surname} setState={setSurname} regEx={regEx.text} helperText='No es un apellido válido' />
            <Input id='email' label='Correo electrónico' state={email} setState={setEmail} disabled={true} />
            <Input id='role' label='Perfil' state={profile} setState={setProfile} disabled={true} />
            <Input id='company' label='Empresa' state={company} setState={setCompany} disabled={true} />
            <Button customFunction={() => { setOpenPassword(true) }} borderColor={themeColors?.primary} color={themeColors?.primary} backgroundColor='transparent' text='Cambiar contraseña' />
            <div className='w-full flex py-8'>
              <Button customFunction={handleSave} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Actualizar perfil' />
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Settings