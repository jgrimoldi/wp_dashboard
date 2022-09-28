import React from 'react';
import { BsXCircle } from 'react-icons/bs';

import { Title, Input, Dropdown, Password, Button, Banner, Modal } from '../../components';

const Register = () => {

  const roles = [];
  const companies = [];

  // const handleValidatePassword = () => {
  //   if (password.value.length > 0) {
  //     if (password.value !== passwordVerify.value) {
  //       setPasswordVerify((prevState) => { return {...prevState, error: true}})
  //     } else {
  //       setPasswordVerify((prevState) => { return {...prevState, error: false}})
  //     }
  //   }
  // }

  return (
    <>
      <Banner text='¡Registro exitoso!' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Modal color='#B00020' icon={<BsXCircle />} />
        <Title category="Registro de" title="Empleados" />
        <div className='w-full md:w-4/5 flex flex-col gap-5 m-auto'>
          <Input id='name' label='Nombre' required={true} />
          <Input id='surname' label='Apellido' required={true} />
          <Input id='email' label='Correo electrónico' required={true} />
          <Dropdown id='role' label='Roles' handleChange={() => { }} value='' options={roles} required={true} />
          <Dropdown id='company' label='Companía' handleChange={() => { }} value='' options={companies} required={true} />
          <Password id='password' label='Contraseña' color='purple' required={true} />
          <Password id='passwordVerify' label='Confirmar contraseña' color='purple' required={true} />
        </div>
        <div className='w-full md:w-4/5 flex justify-end m-auto pt-5'>
          <Button borderColor='blue' color='#FFFFFF' backgroundColor='blue' text='Continuar' />
        </div>
      </div>
    </>
  )
}

export default Register