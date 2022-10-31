import React, { useEffect, useState } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { BsBell, BsBagCheck } from 'react-icons/bs';

import { URL_DASHBOARD } from '../services/Api';
import { useAuthContext } from '../contexts/ContextAuth';
import { getDataFrom } from '../services/GdrService';
import { useStateContext } from '../contexts/ContextProvider';

const ValuedStock = ({ token, handleErrors }) => {
  const [stockPrice, setStockPrice] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getStock = async () => {
      await getDataFrom(URL_DASHBOARD + 'stockValorizado', signal, token)
        .then(response => setStockPrice(response.data[0]['STOCK VALORIZADO']))
        .catch(error => handleErrors(error))
    }
    getStock();
    return () => { controller.abort(); };
  }, [token, handleErrors])

  return (
    <div className='relative rounded-3xl p-5 mt-4 shadow-md bg-gradient-to-br from-[#161ECF] to-[#571CDD] dark:from-[#A2A5FA] dark:to-[#C4A2FA]  '>
      <p className='flex items-start gap-2 font-bold text-base p-1 text-gray-300 dark:text-slate-700'>
        <span className='text-xl'><BsBagCheck /></span>
        Stock valorizado :
      </p>
      <p className='text-white dark:text-slate-900 text-4xl font-bold text-center tracking-tight font-[monospace]'>
        ${stockPrice}
      </p>
    </div>
  )
}

const NewNotification = ({ text, topic }) => {
  const { themeColors } = useStateContext();
  const defaultColor = '#FFFFFF';
  const backgroundByTopic = { INFO: themeColors?.confirm, ALERT: '#FFC300', CRITICAL: themeColors?.error }

  return (
    <div className='relative bg-gray-50 dark:bg-gray-500 rounded-3xl p-5 mt-4 shadow-md'>
      <span style={{ backgroundColor: backgroundByTopic[topic] ?? backgroundByTopic[defaultColor] }} className='absolute inline-flex rounded-full h-2.5 w-2.5 -left-1 -top-1'></span>
      <p className='text-lg text-gray-500 dark:text-gray-50 tracking-tight'>
        {text}
      </p>
    </div>
  )
}

const Notifications = () => {
  const { themeColors } = useStateContext();
  const { auth, handleErrors } = useAuthContext();
  const [click, setClick] = useState('');
  const [filter, setFilter] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const filterBy = {
    ALERT: filter.filter(notification => notification.Topic === 'ALERT'),
    INFO: filter.filter(notification => notification.Topic === 'INFO'),
    CRITICAL: filter.filter(notification => notification.Topic === 'CRITICAL'),
  }

  const handleClick = () => {
    setClick('');
    return filter;
  }

  const handleFilter = (event) => {
    setClick(event.target.value);
    setNotifications(click === String(event.target.value) ? handleClick() : filterBy[event.target.value]);
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getNotifications = async () => {
      await getDataFrom(URL_DASHBOARD + 'novedades', signal, auth.token)
        .then(response => {
          setFilter(response.data);
          setNotifications(response.data)
        })
        .catch(error => handleErrors(error))
    }
    getNotifications();
    return () => { controller.abort(); };
  }, [auth, handleErrors])

  return (
    <div className='sm:absolute right-0 top-0 w-full h-full sm:w-1/3 bg-white dark:bg-secondary-dark-bg rounded-3xl p-4 sm:overflow-hidden overflow-auto sm:hover:overflow-auto shadow-xl'>
      <div className='flex justify-between items-center p-2 pb-3 mb-2 border-b-1'>
        <div className='flex items-center flex-wrap gap-3'>
          <p className='text-xl font-semibold text-black dark:text-white'>Notificaciones</p>
          <div className='flex gap-4'>
            <TooltipComponent content='Filtrar informativos' position='TopCenter'>
              <button type='button' onClick={handleFilter} value='INFO' style={{ backgroundColor: themeColors?.confirm }} className='flex items-center justify-center w-10 h-10 text-xl text-white font-bold rounded-full p-2'>{filterBy.INFO.length}</button>
            </TooltipComponent>
            <TooltipComponent content='Filtrar advertencias' position='TopCenter'>
              <button type='button' onClick={handleFilter} value='ALERT' style={{ backgroundColor: '#FFC300' }} className='flex items-center justify-center w-10 h-10 text-xl text-white font-bold rounded-full p-2'>{filterBy.ALERT.length}</button>
            </TooltipComponent>
            <TooltipComponent content='Filtrar críticos' position='TopCenter'>
              <button type='button' onClick={handleFilter} value='CRITICAL' style={{ backgroundColor: themeColors?.error }} className='flex items-center justify-center w-10 h-10 text-xl text-white font-bold rounded-full p-2'>{filterBy.CRITICAL.length}</button>
            </TooltipComponent>
          </div>
        </div>
        <span className='text-2xl text-black dark:text-white'><BsBell /></span>
      </div>
      <ValuedStock token={auth.token} handleErrors={handleErrors} />
      {
        notifications.map((notification, index) =>
          <NewNotification key={index} text={notification.Mensaje} topic={notification.Topic} />
        )
      }
    </div>
  )
}

export default Notifications