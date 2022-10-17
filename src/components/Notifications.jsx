import React, { useEffect, useState } from 'react';
import { BsBell } from 'react-icons/bs';

import { URL_DASHBOARD } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';

const NewNotification = ({ text, topic }) => {
  const defaultColor = '#FFFFFF';
  const backgroundByTopic = { INFO: '#224C24', ALERT: '#FFC300', CRITICAL: '#B00020' }

  return (
    <div className='relative bg-gray-50 rounded-3xl p-5 mt-4 shadow-md'>
      <span style={{ backgroundColor: backgroundByTopic[topic] ?? backgroundByTopic[defaultColor] }} className='absolute inline-flex rounded-full h-2.5 w-2.5 -left-1 -top-1'></span>
      <p className='text-lg text-gray-500 tracking-tight'>
        {text}
      </p>
    </div>
  )
}

const Notifications = () => {
  const { auth, handleErrors } = useAuthContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getNotifications = async () => {
      await getDataFrom(URL_DASHBOARD + 'novedades', signal, auth.token)
        .then(response => setNotifications(response.data))
        .catch(error => handleErrors(error))
    }
    getNotifications();
    return () => { controller.abort(); };
  }, [auth, handleErrors])

  return (
    <div className='sm:absolute right-0 top-0 w-full h-full sm:w-1/3 bg-white rounded-3xl p-4 sm:overflow-hidden overflow-auto sm:hover:overflow-auto shadow-xl'>
      <div className='flex justify-between items-center p-2 pb-3 mb-2 border-b-1'>
        <p className='text-xl font-semibold'>Notificaciones</p><span className='text-2xl'><BsBell /></span>
      </div>
      {notifications.map((notification, index) =>
        <NewNotification key={index} text={notification.Mensaje} topic={notification.Topic} />
      )}
    </div>
  )
}

export default Notifications