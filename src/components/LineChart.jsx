import React, { useState, useEffect } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';

import { LinePrimaryXAxis, LinePrimaryYAxis } from '../data/dummy';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_DASHBOARD } from '../services/Api';
import { getDataFrom } from '../services/GdrService';

const LineChart = () => {
    const { auth, handleErrors } = useAuthContext();
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpensesData] = useState([]);
    const [dateRange, setDateRange] = useState(30);

    const sumDoubleDates = (array) => {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length; j++) {
                if (i !== j && array[i].fecha.getTime() === array[j].fecha.getTime()) {
                    array[i] = { fecha: new Date(array[i].fecha), total: array[i].total += array[j].total };
                    array.splice(j, 1);
                }
            }
        }

        return array;
    }

    const fixObject = (array) => {
        array.forEach(object => {
            object.fecha = new Date(object.fecha)
            object.total = Number(object.total)
        })
        return array;
    }

    const createMissingData = (array) => {
        const today = new Date();
        const daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - Number(dateRange))
        const aux = [];
        for (daysAgo; daysAgo <= today; daysAgo.setDate(daysAgo.getDate() + 1))
            aux.push({ fecha: new Date(daysAgo), total: 0 })

        const filteredData = aux.filter(objectAux => !array.find(objectData => objectData.fecha.getTime() === objectAux.fecha.getTime()))
        const mergedData = filteredData.concat(array);
        return mergedData.sort((aObject, anObject) => new Date(aObject.fecha) - new Date(anObject.fecha))
    }

    const getLastMovs = (array) => {
        const today = new Date();
        const daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - Number(dateRange))
        const dataFiltered = array.filter(item => new Date(item.fecha) >= daysAgo);

        return (dataFiltered);
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const handleLineChart = async (url, setState) => {
            await getDataFrom(URL_DASHBOARD + url, signal, auth.token)
                .then(response => setState(response.data))
                .catch(error => handleErrors(error))
        }
        handleLineChart('compras', setIncomeData);
        handleLineChart('egresos', setExpensesData);
        return () => { controller.abort(); };
    }, [auth, handleErrors]);

    const lineCustomSeries = [
        { type: 'Line', dataSource: createMissingData(getLastMovs(sumDoubleDates(fixObject(incomeData)))), xName: 'fecha', yName: 'total', name: 'Ingresos', width: '2', marker: { visible: true, width: 10, height: 10 }, },
        { type: 'Line', dataSource: createMissingData(getLastMovs(sumDoubleDates(fixObject(expenseData)))), xName: 'fecha', yName: 'total', name: 'Egresos', width: '2', marker: { visible: true, width: 10, height: 10 }, },
    ];

    return (
        <div className='w-full bg-white p-5 rounded-lg shadow-xl'>
            <div className='flex justify-between items-center gap-2 mb-2'>
                <p className='text-xl font-semibold'>Ingresos/Egresos</p>
                <div>Rango de días {' : '}
                    <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                        <option value={7}>7 días</option>
                        <option value={15}>15 días</option>
                        <option value={30}>30 días</option>
                    </select>
                </div>
            </div>
            <div className='md:w-full overflow-auto'>
                <ChartComponent
                    id="line-chart"
                    height="350px"
                    tooltip={{ enable: true }}
                    primaryXAxis={LinePrimaryXAxis}
                    primaryYAxis={LinePrimaryYAxis}
                    chartArea={{ border: { width: 1 } }}
                    background='#FFFFFF'
                    legendSettings={{ background: 'white' }}
                >
                    <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
                    <SeriesCollectionDirective>
                        {lineCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} />)}
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        </div>
    );
};

export default LineChart;