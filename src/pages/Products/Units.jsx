import React, { useEffect, useState } from 'react';
import { BsXCircle, BsTrash } from 'react-icons/bs';

import { SEO, Banner, Title, Table, Input, Button, Modal } from '../../components';
import { unitsGrid, regEx } from '../../data/dummy';
import { URL_UNIT } from '../../services/Api';
import { useAuthContext } from '../../contexts/ContextAuth';
import { deleteDataByIdFrom, getDataFrom } from '../../services/GdrService';
import { insertUnit } from '../../services/ProductService';

const Units = () => {
  const { auth, setAuth } = useAuthContext();
  const [banner, setBanner] = useState({ valid: null, error: null });
  const [unitsData, setUnitsData] = useState([]);

  const [newUnit, setNewUnit] = useState({ value: '', error: null });
  const [abbreviation, setAbbreviation] = useState({ value: '', error: null });
  const [idSelected, setIdSelected] = useState('');
  const [openModal, setOpenModal] = useState({ value: '', open: null });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getUnits = async () => {
      await getDataFrom(URL_UNIT, signal, auth.token)
        .then(response => {
          setUnitsData(response.data);
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }
    getUnits();
    return () => { controller.abort(); };
  }, [auth, setAuth])


  const addUnit = async () => {
    if (newUnit.error === false && abbreviation.error === false) {
      await insertUnit(newUnit.value, abbreviation.value, auth.token)
        .then(response => {
          setUnitsData(prevState => [...prevState, response.data]);
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(error => {
          if (error.response.data.error === 'ERROR_VALIDATION_UNIDAD_MEDIDA') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
            return;
          }
          setBanner({ ...banner, valid: false, error: true });
        })
    } else {
      setBanner({ ...banner, valid: false, error: true });
    }
  }

  const confirmDelete = () => {
    const objectsId = unitsData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_UNIT, openModal.value, auth.token)
      .then(() => {
        setUnitsData(current => current.filter(unit => unit.id !== Number(openModal.value)));
        setBanner({ ...banner, deleted: true });
      })
      .catch(() => {
        setBanner({ ...banner, error: true });
      })
      .finally(() => {
        setOpenModal({ ...openModal, value: '', open: false })
      })
  }

  return (
    <>
      <SEO title='Unidades de medida' />
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
      {banner.valid === true && <Banner text='¡Nueva unidad de medida agregada!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
      {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <Title category="Unidades de" title="Medida" />
        <div className='w-full flex flex-wrap justify-center gap-5 pb-5'>
          <Input id='unit' label='Nueva unidad de medida' size='small' css='w-full sm:w-2/5' required={true} state={newUnit} setState={setNewUnit} regEx={regEx.notEmpty} />
          <Input id='details' label='Detalles de la unidad' size='small' css='w-full sm:w-2/5' required={true} state={abbreviation} setState={setAbbreviation} regEx={regEx.notEmpty} />
          <Button customFunction={addUnit} borderColor='blue' color='white' backgroundColor='blue' width='12/6' text='Agregar unidad de medida' />
        </div>
        <Table header={unitsGrid} data={unitsData} filterTitle='Unidades de Medida' checkbox={true} stateCheckbox={idSelected} setStateCheckbox={setIdSelected} />
        {!!idSelected &&
          <div className='flex gap-2 justify-end pt-5'>
            <Button customFunction={() => setIdSelected('')} borderColor='black' color='black' backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
            <Button customFunction={confirmDelete} borderColor='blue' color='white' backgroundColor='blue' width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
          </div>}
      </div>
    </>
  )
}

export default Units