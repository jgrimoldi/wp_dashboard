import React, { useEffect, useState } from 'react';
import { BsCloudArrowDown, BsSearch, BsCloudUpload } from 'react-icons/bs';

import { Title, SEO, Table, TableHead, Input, Button, Banner } from '../../components';
import { backupGrid } from '../../data/dummy';
import { URL_BACKUP } from '../../services/Api';
import useTable from '../../hooks/useTable';
import { useAuthContext } from '../../contexts/ContextAuth';
import { createBackup } from '../../services/BackupService';
import { getDataFrom } from '../../services/GdrService';

const BackupData = ({ backups, filteredValue }) => {
  return (
    backups.length !== 0 ?
      backups.filter(backup => backup.nombre.includes(filteredValue.value) || backup.createdBy.includes(filteredValue.value) || backup.size.includes(filteredValue.value)).map((item, index) =>
        <tr key={index} className='bg-white even:bg-gray-50'>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{item.id}</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{item.nombre}</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{item.createdBy}</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>{item.size}</td>
          <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
            <a href={item.url} style={{ color: 'blue' }} className='flex items-center gap-1 font-bold hover:underline' target='_blank' rel="noreferrer" download='filename'>
              Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
            </a>
          </td>
        </tr>
      )
      : <tr className='text-center bg-white even:bg-gray-50'><td className='p-3 text-sm text-gray-700 whitespace-nowrap'>No hay entradas para mostrar</td></tr>
  )
}

const Backup = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [backups, setBackups] = useState([]);
  const [filteredValue, setFilteredValue] = useState({ value: '', error: null });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const { slice } = useTable(backups, page, rowsPerPage);

  useEffect(() => {
    const getBackups = async () => {
      await getDataFrom(URL_BACKUP, auth.token)
        .then(response => {
          setBackups(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getBackups();
  }, [auth, setAuth, backups, setBackups])

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

  return (
    <>
      <SEO title='Backup' />
      {banner.valid === true && <Banner text='¡Backup exitoso!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! El backup no pudo realizarse' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Mis" title="Backups" />
        <div>
          <div className='shadow flex justify-end p-2 bg-gray-50 border-b-2 border-gray-200'>
            <Input id='filter' label='Buscar en Mis Backups' size='small' css='w-full sm:w-1/2'
              state={filteredValue} setState={setFilteredValue}
              tooltip='Filtrar mis backups' color='blue' icon={<BsSearch />}
            />
          </div>
          <Table childrenHead={<TableHead headSource={backupGrid} />} childrenData={<BackupData backups={slice} filteredValue={filteredValue} />} data={backups} page={page} setPage={setPage} rowsPerPage={rowsPerPage} >
            {backups.length !== 0 ?
              slice.filter(backup => backup.nombre.includes(filteredValue.value) || backup.createdBy.includes(filteredValue.value) || backup.size.includes(filteredValue.value)).map((item, index) =>
              (<div key={index} className='bg-white space-y-3 p-4 rounded-lg shadow'>
                <div className='flex items-center space-x-2 text-sm'>
                  <div style={{ backgroundColor: 'blue' }} className='flex items-center justify-center w-6 h-6 text-white rounded-full'>{item.id}</div>
                  <div>{item.createdBy}</div>
                  <div>{item.size}</div>
                </div>
                <div>{item.nombre}</div>
                <div>
                  <a href={item.url} style={{ color: 'blue' }} className='flex items-center gap-1 font-boldhover:underline' target='_blank' rel="noreferrer" download='filename'>
                    Descargar <span className='text-2xl'><BsCloudArrowDown /></span>
                  </a>
                </div>
              </div>)
              )
              : <p className='p-3 text-sm text-gray-700 whitespace-nowrap'>No hay entradas para mostrar</p>
            }
          </Table>
        </div>
        <div className='w-full flex justify-end py-8'>
          <Button customFunction={handleBackup} borderColor='blue' color='white' backgroundColor='blue' text='Nuevo backup' icon={<BsCloudUpload />} />
        </div>
      </div>
    </>
  )
}

export default Backup