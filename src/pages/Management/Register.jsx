import React, { useState, useEffect } from 'react';

import { regEx } from '../../data/dummy';
import { Title, Input, Dropdown, Password, Button, Banner, ErrorLabel, SEO, GroupValidator } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { URL_COMPANY, URL_PROFILE } from '../../services/Api';
import { registerUser } from '../../services/AuthService';
import { getDataFrom } from '../../services/GdrService';
import { useStateContext } from '../../contexts/ContextProvider';

const Register = () => {
  const { themeColors } = useStateContext();
  const { auth, setAuth } = useAuthContext();
  const [name, setName] = useState({ value: '', error: null });
  const [surname, setSurname] = useState({ value: '', error: null });
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [passwordVerify, setPasswordVerify] = useState({ value: '', error: null });
  const [optionsProfile, setOptionsProfiles] = useState([]);
  const [optionsCompanies, setOptionsCompanies] = useState([]);
  const [profileValue, setProfileValue] = useState({ value: optionsProfile[0], error: null });
  const [companiesValue, setCompaniesValue] = useState({ value: optionsCompanies[0], error: null });
  const [errorForm, setErrorForm] = useState({ value: '', error: null });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getInfo = async (URL, setState) => {
      await getDataFrom(URL, signal, auth.token)
        .then(response => {
          setState(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getInfo(URL_PROFILE, setOptionsProfiles);
    getInfo(URL_COMPANY, setOptionsCompanies);
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const handleValidatePassword = () => {
    if (password.value.length > 0) {
      if (password.value !== passwordVerify.value) {
        setPasswordVerify((prevState) => { return { ...prevState, error: true } })
      } else {
        setPasswordVerify((prevState) => { return { ...prevState, error: false } })
      }
    }
  }

  const setEmpty = () => {
    setName({ ...name, value: '', error: null });
    setSurname({ ...surname, value: '', error: null });
    setEmail({ ...email, value: '', error: null });
    setPassword({ ...password, value: '', error: null });
    setPasswordVerify({ ...passwordVerify, value: '', error: null });
  }

  const handleRegister = async () => {
    if (name.error === false
      && surname.error === false
      && email.error === false
      && password.error === false
      && passwordVerify.error === false
      && profileValue.error === false
      && companiesValue.error === false
    ) {
      await registerUser(email.value, password.value, name.value, surname.value, profileValue.id, companiesValue.id, 1, auth.token)
        .then(response => {
          setErrorForm({ ...errorForm, value: '', error: false });
          setEmpty();
        })
        .catch(() => {
          setErrorForm({ ...errorForm, value: 'Ocurrió un error! Vuelva a intentar.', error: true });
        })
    } else {
      setErrorForm({ ...errorForm, value: 'Revise si los campos son correctos.', error: true });
    }
  }
  const profiles = !!auth.user && auth.user.fk_perfil !== 3 ? optionsProfile.filter(option => option.nom_perfil !== 'dev') : optionsProfile

  return (
    <>
      <SEO title='Registro de usuarios' />
      {errorForm.error === false && <Banner text='Registro exitoso!' backgroundColor='green' setState={() => setErrorForm({ ...errorForm, error: null })} />}
      {errorForm.error === true && <Banner text='¡Ups! El registro no pudo realizarse' backgroundColor='red' setState={() => setErrorForm({ ...errorForm, error: null })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category="Registro de" title="Empleados" />
        <div className='w-full md:w-4/5 flex flex-col gap-5 m-auto'>
          <Input id='name' label='Nombre' state={name} setState={setName} regEx={regEx.text} helperText='No es un nombre válido' required={true} />
          <Input id='surname' label='Apellido' state={surname} setState={setSurname} regEx={regEx.text} helperText='No es un apellido válido' required={true} />
          <Input id='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' required={true} />
          <Dropdown id='role' label='Perfil' state={profileValue} setState={setProfileValue} options={profiles} getter='nom_perfil' helperText='Elija un perfil' required={true} />
          <Dropdown id='company' label='Empresa' state={companiesValue} setState={setCompaniesValue} options={optionsCompanies} getter='nombre' helperText='Elija una empresa' required={true} />
          <Password id='password' label='Contraseña' color={themeColors?.secondary} state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' />
          {!!password.value && <GroupValidator password={password.value} />}
          <Password id='passwordVerify' label='Confirmar contraseña' color={themeColors?.secondary} state={passwordVerify} setState={setPasswordVerify} customFunction={handleValidatePassword} helperText='Las contraseñas no coinciden' />
          {!!errorForm.value && <ErrorLabel color='red'>{errorForm.value}</ErrorLabel>}
        </div>
        <div className='w-full md:w-4/5 flex gap-1 justify-end m-auto pt-5'>
          <Button customFunction={setEmpty} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Vaciar entradas' height={true} />
          <Button customFunction={handleRegister} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Registrar usuario' height={true} />
        </div>
      </div>
    </>
  )
}

export default Register