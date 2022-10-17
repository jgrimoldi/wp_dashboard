import React, { useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';

import { LinePrimaryXAxis, LinePrimaryYAxis } from '../data/dummy';
import { useAuthContext } from '../contexts/ContextAuth';
import { URL_DASHBOARD } from '../services/Api';
import { getDataFrom } from '../services/GdrService';
import { useEffect } from 'react';

const LineChart = () => {
    const { auth, handleErrors } = useAuthContext();
    const [chartData, setChartData] = useState([]);


    useEffect(() => {
        const transformIntoDate = (date) => new Date(date.replaceAll('-', ', '));

        const formatChartData = (array) => {
            const aux = []
            const property = Object.getOwnPropertyNames(array[0]);
            array.map(info => (
                aux.push({ x: new Date(2022, 6, 1), y: 0 }, { x: transformIntoDate(info[property[0]]), y: Number(info[property[1]]) })
            ))
            return aux;
        }
        const handleLineChart = async (url) => {
            await getDataFrom(URL_DASHBOARD + url, null, auth.token)
                .then(response => setChartData((prevState) => [...prevState, formatChartData(response.data)]))
                .catch(error => handleErrors(error))
        }
        handleLineChart('compras');
        handleLineChart('egresos');
    }, [auth, handleErrors]);

    const lineCustomSeries = [
        {
            type: 'Line',
            dataSource: chartData[0],
            xName: 'x',
            yName: 'y',
            name: 'Ingresos',
            width: '2',
            marker: { visible: true, width: 10, height: 10 },
        },
        {
            type: 'Line',
            dataSource: chartData[1],
            xName: 'x',
            yName: 'y',
            name: 'Egresos',
            width: '2',
            marker: { visible: true, width: 10, height: 10 },
        },
    ];

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