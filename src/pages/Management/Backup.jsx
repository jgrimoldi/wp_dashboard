import React, { useEffect, useState } from 'react';
import { BsCloudUpload } from 'react-icons/bs';

import { Title, SEO, Table, Button, Banner } from '../../components';
import { backupGrid } from '../../data/dummy';
import { URL_BACKUP } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { createBackup } from '../../services/BackupService';
import { getDataFrom } from '../../services/GdrService';

const Backup = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [backupData, setBackupData] = useState([]);

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

  const handleBackup = async () => {
    await createBackup(auth.user.id, auth.token)
      .then(() => {
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

  const sortByLastCreated = (data, anotherData) => new Date(anotherData['Fecha Creación']) < new Date(data['Fecha Creación']) ? -1 : 1

  return (
    <>
      <SEO title='Backup' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Backups" />
        <Table header={backupGrid} data={backupData} filterTitle='Mis Backups' checkbox={false} sortFunction={sortByLastCreated} />
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={handleBackup} borderColor='blue' color='white' backgroundColor='blue' text='Nuevo backup' icon={<BsCloudUpload />} />
        </div>
      </div>
    </>
  )
}

export default Backup