import React, { useEffect, useState } from 'react';
import { BsCloudUpload } from 'react-icons/bs';

import { Title, SEO, Table, Button, Banner } from '../../components';
import { backupGrid } from '../../data/dummy';
import { URL_BACKUP } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { createBackup } from '../../services/BackupService';
import { getDataFrom } from '../../services/GdrService';
import { useStateContext } from '../../contexts/ContextProvider';

const Backup = () => {
  const { themeColors } = useStateContext();
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [backupData, setBackupData] = useState([]);

  useEffect(() => {
    let shadowBanner = setTimeout(() => setBanner({ error: null }), 2000);
    return () => { clearTimeout(shadowBanner) };
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getBackups = async () => {
      await getDataFrom(URL_BACKUP, signal, auth.token)
        .then(response => {
          setBackupData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getBackups();
    return () => { controller.abort(); };
  }, [auth, setAuth])

  const getNewObject = (object) => {
    return { createdAt: new Date(object.createdAt), nombre: object.nombre, size: object.size, url: object.url };
  }

  const handleBackup = async () => {
    await createBackup(auth.user.id, auth.token)
      .then(response => {
        const newObject = getNewObject(response.data);
        setBackupData(prevState => [newObject, ...prevState]);
        setBanner({ ...banner, valid: true })
      })
      .catch(error => {
        if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
          setAuth({});
          localStorage.removeItem('_fDataUser');
        }
        setBanner({ ...banner, error: true })
      })
  }

  const sortByLastCreated = (data, anotherData) => new Date(anotherData['createdAt']) < new Date(data['createdAt']) ? -1 : 1

  return (
    <>
      <SEO title='Backup' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Title category="Mis" title="Backups" />
        <Table header={backupGrid} data={backupData} filterTitle='Mis Backups' checkbox={false} sortFunction={sortByLastCreated} />
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={handleBackup} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Nuevo backup' icon={<BsCloudUpload />} />
        </div>
      </div>
    </>
  )
}

export default Backup