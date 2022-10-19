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
    const lineCustomSeries = [
        { type: 'Line', dataSource: incomeData, xName: 'fecha', yName: 'total', name: 'Ingresos', width: '2', marker: { visible: true, width: 10, height: 10 }, },
        { type: 'Line', dataSource: expenseData, xName: 'fecha', yName: 'total', name: 'Egresos', width: '2', marker: { visible: true, width: 10, height: 10 }, },
    ];

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

    const consecutiveDates = (aNumber, otherNumber) => {
        if (otherNumber !== undefined)
            return aNumber.fecha.getTime() + 1 === otherNumber.fecha.getTime();
        else
            return true
    }


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const createMissingData = (array) => {
            const aux = [];
            for (let i = 0; i < array.length; i++) {
                aux.push(array[i]);
                if (!consecutiveDates(array[i], array[i + 1])) {
                    const maxDate = new Date(array[i + 1].fecha)
                    for (const nextDay = new Date(array[i].fecha); nextDay < maxDate; nextDay.setDate(nextDay.getDate() + 1)) {
                        aux.push({ fecha: new Date(nextDay), total: 0 })
                    }
                }
            }
            return aux;
        }

        const handleLineChart = async (url, setState) => {
            await getDataFrom(URL_DASHBOARD + url, signal, auth.token)
                .then(response => setState(sumDoubleDates(createMissingData(fixObject(response.data)))))
                .catch(error => handleErrors(error))
        }
        handleLineChart('compras', setIncomeData);
        handleLineChart('egresos', setExpensesData);
        return () => { controller.abort(); };
    }, [auth, handleErrors]);

    return (
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
    );
};

export default LineChart;