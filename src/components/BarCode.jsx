import React, { useEffect, useState, useRef } from 'react';
import { BsPencil, BsTrash, BsXCircle } from 'react-icons/bs';

import { Button, Input, Modal, Banner } from '.';
import { useAuthContext } from '../contexts/ContextAuth';
import { useStateContext } from '../contexts/ContextProvider';
import { barcodeGrid, regEx } from '../data/dummy';
import { URL_BARCODE, URL_PRODUCT } from '../services/Api';
import { deleteDataByIdFrom, getDataByIdFrom } from '../services/GdrService';
import { findBarcodeByProduct, insertBarCode, updateBarcodeById } from '../services/ProductService';
import { Radio } from './Table';

const BarCode = ({ productID, setState }) => {
  const { themeColors } = useStateContext();
  const { auth, setAuth } = useAuthContext();
  const refFocus = useRef(null);
  const [barcodesData, setBarcodesData] = useState([]);
  const [product, setProduct] = useState({ name: '', quantity: '' });
  const [barcodes, setBarcodes] = useState({ value: '', error: null });
  const [idSelected, setIdSelected] = useState('');
  const [banner, setBanner] = useState({ valid: null, error: null, deleted: null, edit: null });
  const [openModal, setOpenModal] = useState({ value: '', open: null });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    let shadowBanner = setTimeout(() => setBanner({ valid: null, error: null, deleted: null, edit: null }), 4000);
    return () => { clearTimeout(shadowBanner) };
  });

  useEffect(() => {
    const getProductName = async () => {
      await getDataByIdFrom(URL_PRODUCT, Number(productID), auth.token)
        .then(response => {
          setProduct((prevState) => { return { ...prevState, name: response.data[0].nombre, quantity: response.data[0].cantidad } });
        })
        .catch(error => {
          if (error.response.data.error === 'NOT_PAYLOAD_DATA_JWT') {
            setAuth({});
            localStorage.removeItem('_fDataUser');
          }
        })
    }

    const getBarcodes = async () => {
      await findBarcodeByProduct(Number(productID), auth.token)
        .then(response => {
          setBarcodesData(response.data);
        })
        .catch(() => {
          setBarcodesData([]);
        })
    }

    getProductName();
    getBarcodes();
  }, [auth, setAuth, productID])

  const handleClose = () => setState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (barcodes.error === false) {
      await insertBarCode(Number(productID), barcodes.value, auth.token)
        .then(response => {
          setBarcodesData(prevState => [...prevState, response.data]);
          setBarcodes((prevState) => { return { ...prevState, value: '' } });
          setBanner({ ...banner, valid: true, error: false });
        })
        .catch(() => {
          setBanner({ ...banner, valid: false, error: true });
        })
        .finally(() => {
          refFocus.current.focus();
        })
    } else {
      setBanner({ ...banner, valid: false, error: true });
    }
  }

  const confirmDelete = () => {
    const objectsId = barcodesData.map(({ id }) => id);
    if (!!idSelected && objectsId.includes(Number(idSelected)))
      setOpenModal({ ...openModal, value: idSelected, open: true });
  }

  const deleteDataById = async () => {
    await deleteDataByIdFrom(URL_BARCODE, openModal.value, auth.token)
      .then(() => {
        setBarcodesData(current => current.filter(barcode => barcode.id !== Number(openModal.value)));
        setBanner({ ...banner, deleted: true });
      })
      .catch(() => {
        setBanner({ ...banner, error: true });
      })
      .finally(() => {
        setOpenModal({ ...openModal, value: '', open: false })
      })
  }

  const editInputs = async () => {
    await getDataByIdFrom(URL_BARCODE, idSelected, auth.token)
      .then(response => {
        setBarcodes({ ...barcodes, value: response.data.codigodebarra });
      })
      .catch(() => {
        setBarcodes({ ...barcodes, value: '' });
      })
      .finally(() => {
        setEdit(true);
        refFocus.current.focus();
      })
  }

  const editBarcode = async () => {
    await updateBarcodeById(idSelected, productID, barcodes.value, auth.token)
      .then(() => {
        const selected = barcodesData.find(barcode => barcode.id === Number(idSelected));
        selected.codigodebarra = barcodes.value;
        setBanner({ ...banner, edit: true });
      })
      .catch(() => {
        setBanner({ ...banner, error: true });
      })
      .finally(() => {
        setBarcodes({ ...barcodes, value: '' });
        setIdSelected('');
        setEdit(false);
      })
  }

  return (
    <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0 overflow-hidden'>
      {
        openModal.open === true &&
        <Modal title='¿Está seguro que quiere eliminar este registro?' text={`El siguiente elemento (id: ${idSelected}) esta a punto de ser eliminado, ¿Desea continuar?`}
          color='red' icon={<BsXCircle />} setFunction={() => setOpenModal({ ...openModal, value: '', open: null })} buttonText='Eliminar registro'
          redirect='' customFunction={deleteDataById}
        />
      }
      <div className='mt-20'>
        {banner.edit === true && <Banner text='¡Registro editado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, edit: false })} />}
        {banner.deleted === true && <Banner text='¡Registro eliminado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, deleted: false })} />}
        {banner.valid === true && <Banner text='¡Nuevo codigo agregado exitosamente!' backgroundColor='green' setState={() => setBanner({ ...banner, valid: false })} />}
        {banner.error === true && <Banner text='¡Ups! No se pudo realizar la acción.' backgroundColor='red' setState={() => setBanner({ ...banner, error: false })} />}
      </div>
      <div className='h-screen flex items-center justify-center'>
        <div className='flex flex-col item gap-5 bg-white dark:bg-secondary-dark-bg w-11/12 sm:w-4/5 lg:w-3/5 p-5 rounded-3xl'>
          <form onSubmit={handleSubmit} className='w-full md:w-2/5 flex flex-col justify-center items-center gap-2'>
            <div className='self-start text-lg dark:text-slate-100'>Códigos de barras para {product.name}</div>
            <Input id='barcode' type='number' useRef={refFocus} label='Ingrese código de barras' css='w-full' state={barcodes} setState={setBarcodes} regEx={regEx.notEmpty} helperText='El campo no puede estar vacío' />
            <div className='w-full flex gap-1'>
              <Button customFunction={handleClose} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' text='Cerrar' width='1/2' />
              {edit === true ? <Button customFunction={editBarcode} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' text='Editar código' />
                : <Button customFunction={handleSubmit} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} text='Guardar' width='1/2' />}
            </div>
          </form>
          <div className='w-full flex flex-wrap justify-evenly md:gap-2 m-auto items-center m:overflow-hidden overflow-auto sm:hover:overflow-auto'>
            {barcodesData.map(barcode => (
              barcodeGrid.map((grid, index) =>
                <div key={index} className='w-full flex items-center gap-2 sm:w-1/2 md:w-72 p-4 border rounded-full shadow dark:text-slate-100'>
                  <Radio data={barcode} state={idSelected} setState={setIdSelected} />
                  {barcode[grid.field]}
                </div>
              )
            ))}
          </div>
          {!!idSelected &&
            <div className='flex gap-2 justify-end pt-5'>
              <Button customFunction={() => { setIdSelected(''); setBarcodes({ ...barcodes, value: '' }); }} borderColor={themeColors?.highEmphasis} color={themeColors?.highEmphasis} backgroundColor='transparent' width='12/6' height='normal' text='Cancelar' />
              <Button customFunction={editInputs} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Editar registro' icon={<BsPencil />} />
              <Button customFunction={confirmDelete} borderColor={themeColors?.primary} color={themeColors?.background} backgroundColor={themeColors?.primary} width='12/6' height='normal' text='Eliminar registro' icon={<BsTrash />} />
            </div>}
        </div>
      </div>
    </div>
  )
}

export default BarCode