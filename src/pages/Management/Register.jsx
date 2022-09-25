import React from 'react';

import { Title, Input, Dropdown, Password, Button } from '../../components';

const Register = () => {

  const roles = [];
  const companies = [];


  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Title category="Registro de" title="Empleados" />
      <div className='w-full md:w-4/5 flex flex-col gap-5 m-auto'>
        <Input id='name' label='Nombre' required={true} />
        <Input id='surname' label='Apellido' required={true} />
        <Input id='email' label='Correo electrónico' required={true} />
        <Dropdown id='role' label='Roles' handleChange={() => { }} value='' options={roles} required={true} />
        <Dropdown id='company' label='Companía' handleChange={() => { }} value='' options={companies} required={true} />
        <Password id='password' label='Contraseña' required={true} />
        <Password id='passwordVerify' label='Confirmar contraseña' required={true} />
      </div>
      <div className='w-full md:w-4/5 flex justify-end m-auto pt-5'>
        <Button color='white' backgroundColor='blue' text='Registrar' />
      </div>
    </div>
  )
}

export default Register