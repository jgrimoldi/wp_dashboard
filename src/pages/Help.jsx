import React from 'react';
import { BsExclamationCircle } from 'react-icons/bs';

import { SEO, Title } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Help = () => {
  const { themeColors } = useStateContext();

  return (
    <>
      <SEO title='Ayuda' />
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category="AGStock" title="Soporte" />
        <div className='w-4/5 m-auto -mt-5'>
          <div className='flex items-center gap-6'>
            <span className='text-6xl text-gray-600 dark:text-gray-400'><BsExclamationCircle /></span>
            <h2 className='text-3xl text-justify text-gray-600 dark:text-gray-400 font-bold'>Puedes ponerte en contacto con el servicio de asistencia de para que te ayude a resolver los problemas que encuentres al utilizar AGStock.</h2>
          </div>
          <div className='ml-0 m-5 text-slate-900 dark:text-slate-100 '>
            <h3 className='text-2xl font-extrabold tracking-tight pb-1 border-b-1 border-gray-700 mb-5'>Qué incluir en tu ticket de soporte</h3>
            <p className='mb-5'>El proporcionar al Soporte de AGStock todo lo que necesita para entender, ubicar y reproducir un problema permitirá que exista una resolución más rápida y menos juego entre tú y el equipo de soporte. Para garantizar que el Soporte de AGStock puede darte asistencia, considera los siguientes puntos cuando escribes tu ticket:</p>
            <li className='mb-2'>Obtener información que pueda ayudar a que el Soporte de AGStock rastree, priorice, reproduzca o investigue el problema.</li>
            <li className='mb-2'>Incluir URLs, datos y nombre de usuario completo cada que sea posible.</li>
            <li className='mb-2'>Reproducir el problema, en caso de que sea posible, y prepararte para compartir los pasos.</li>
            <li className='mb-2'>Estar preparado para brindar una descripción completa de la propuesta y los resultados esperados.</li>
            <li className='mb-2'>Copiar de manera exacta, palabra por palabra, todos los mensajes del error relacionados con tu problema.</li>
            <li className='mb-2'>Incluye las bitácoras relevantes y adjunta cualquier captura de pantalla que demuestre el problema.</li>
          </div>
          <div className='ml-0 m-5 text-slate-900 dark:text-slate-100 '>
            <h3 className='text-2xl font-extrabold tracking-tight pb-1 border-b-1 border-gray-700 mb-5'>Crea un ticket de soporte</h3>
            <p className='mb-2'>Para crear tu ticket de soporte, comunicate con nosotros a nuestro <a style={{ color: themeColors?.primary }} className='hover:underline' href='mailto:info@agsistemas.net.ar'>Contacto de Soporte</a> [info@agsistemas.net.ar]</p>
            <p><span style={{ color: '#FFC300' }} className='text-lg font-bold'>¡Importante!</span> En "Asunto", escriba un título descriptivo del problema que tiene. Recuerde también proporcionar cualquier información adicional que ayude al eqiupo de asistencia a solucionar el problema.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Help