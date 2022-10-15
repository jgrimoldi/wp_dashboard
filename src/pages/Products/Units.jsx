import React, { useState, useRef } from 'react';

import { SEO, Crud } from '../../components';
import { useAuthContext } from '../../contexts/ContextAuth';
import { unitsGrid } from '../../data/dummy';
import { URL_UNIT } from '../../services/Api';
import { insertUnit, updateUnitById } from '../../services/ProductService';

const Units = () => {
  const { auth } = useAuthContext();
  const refFocus = useRef(null);
  const initialState = { value: '', error: null };
  const [newUnit, setNewUnit] = useState(initialState);
  const [abbreviation, setAbbreviation] = useState(initialState);
  const inputConfig = [
    { field: 'magnitud', id: 'unit', useRef: refFocus, label: 'Nueva unidad de medida', state: newUnit, setState: setNewUnit, expression: 'notEmpty', css: 'w-full sm:w-[30%] md:w-1/4' },
    { field: 'abreviatura', id: 'details', label: 'Detalles de la unidad', state: abbreviation, setState: setAbbreviation, expression: 'notEmpty', css: 'w-full sm:w-[30%] md:w-1/4' },
  ];

  const addUnits = async () => {
    const response = await insertUnit(newUnit.value, abbreviation.value, auth.token);
    return await response;
  }

  const updateUnits = async (id) => {
    const response = await updateUnitById(id, newUnit.value, abbreviation.value, auth.token);
    return await response;
  }

  return (
    <>
      <SEO title='Unidades de medida' />
      <Crud sufix='Unidades de' title='Medida' config={inputConfig} URL={URL_UNIT} grid={unitsGrid} add={addUnits} update={updateUnits} />
    </>
  )
}

export default Units