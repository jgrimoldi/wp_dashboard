import React, { useState } from 'react';
import { BsXCircle } from 'react-icons/bs';

import { regEx } from '../../data/dummy';
import { Title, Input, Dropdown, Password, Button, Banner, Modal, SEO, GroupValidator } from '../../components';

const Register = () => {

  const [name, setName] = useState({ value: '', error: null });
  const [surname, setSurname] = useState({ value: '', error: null });
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [passwordVerify, setPasswordVerify] = useState({ value: '', error: null });

  const roles = [];
  const companies = [];

  const handleValidatePassword = () => {
    if (password.value.length > 0) {
      if (password.value !== passwordVerify.value) {
        setPasswordVerify((prevState) => { return { ...prevState, error: true } })
      } else {
        setPasswordVerify((prevState) => { return { ...prevState, error: false } })
      }
    }
  }

  return (
    <>
      <SEO title='Registro de usuarios' />
      <Banner text='¡Registro exitoso!' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        {/* <Modal color='red' icon={<BsXCircle />} /> */}
        <Title category="Registro de" title="Empleados" />
        <div className='w-full md:w-4/5 flex flex-col gap-5 m-auto'>
          <Input id='name' label='Nombre' state={name} setState={setName} regEx={regEx.text} helperText='No es un nombre válido' required={true} />
          <Input id='surname' label='Apellido' state={surname} setState={setSurname} regEx={regEx.text} helperText='No es un apellido válido' required={true} />
          <Input id='email' label='Correo electrónico' state={email} setState={setEmail} regEx={regEx.email} helperText='No es un correo válido' required={true} />

          <Dropdown id='role' label='Perfil' handleChange={() => { }} value='' options={roles} required={true} />
          <Dropdown id='company' label='Empresa' handleChange={() => { }} value='' options={companies} required={true} />

          <Password id='password' label='Contraseña' color='purple' state={password} setState={setPassword} regEx={regEx.password} helperText='No es una contraseña válida' />
          {!!password.value && <GroupValidator password={password.value} />}
          <Password id='passwordVerify' label='Confirmar contraseña' color='purple' state={passwordVerify} setState={setPasswordVerify} customFunction={handleValidatePassword} helperText='Las contraseñas no coinciden' />
        </div>
        <div className='w-full md:w-4/5 flex justify-end m-auto pt-5'>
          <Button borderColor='blue' color='#FFFFFF' backgroundColor='blue' text='Continuar' height={true} />
        </div>
      </div>
    </>
  )
}

export default Register