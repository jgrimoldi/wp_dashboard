import React from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { BsCloudArrowDown } from 'react-icons/bs';
import { Document, Page, View, Text, StyleSheet, Image, Font } from '@react-pdf/renderer';

import agLogo from '../data/agSistemasBase.png';
import regular from '../data/fonts/RobotoMono-Regular.ttf';
import bold from '../data/fonts/RobotoMono-Bold.ttf';


const Dates = ({ date }) => {
    const fullDate = new Date(date);
    const formatDate = (date) => date < 10 ? `0${date}` : date
    const year = formatDate(fullDate.getFullYear());
    const month = formatDate(fullDate.getMonth() + 1);
    const day = formatDate(fullDate.getDate());
    const hours = formatDate(fullDate.getHours());
    const seconds = formatDate(fullDate.getMinutes());

    return (
        <Text>
            {year}-{month}-{day} {hours}:{seconds}
        </Text>
    )
};

const FormatDesktop = ({ data, property }) => {

    if (property.field === 'url') {
        return (
            <a href={data[property.field]}
                className='flex items-center gap-1 font-bold hover:underline'
                target='_blank' rel="noreferrer" download='filename' >
                Descargar <Text className='text-2xl'><BsCloudArrowDown /></Text>
            </a>
        );
    }

    if (property.field === 'unitPrice' || property.field === 'price' || property.field === 'VAT' || property.field === 'subTotal') {
        return ('$' + data[property.mobile]);
    }

    if (property.field === 'Fecha Creación' || property.field === 'lastlogin' || property.mobile === 'createdAt') {
        let date = new Date(data[property.field]);
        date = new Date(date.getTime() + 3 * 60 * 60 * 1000);
        return (<Dates date={date} />);
    }

    if (property.field === 'alicuota') {
        return (<Text>{data[property.field]}%</Text>);
    }

    if (property.field === 'validateAccount') {
        const today = new Date();
        let expires = new Date(data.validateAccountExpires);
        expires = new Date(expires.getTime() + 3 * 60 * 60 * 1000);

        if ((data[property.field] === null || data[property.field] === false) && expires < today) {
            return (
                <TooltipComponent content={`Reenviar validación a ${data.email}`} position="BottomCenter">
                    <Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>
                        Sin validar
                    </Text>
                </TooltipComponent>
            );
        }
        if (expires >= today)
            return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Sin validar</Text>);

        return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 dark:bg-green-800 dark:text-green-200 rounded-lg bg-opacity-50'>Validado</Text>);
    }

    if (property.field === 'validateAccountExpires') {
        const today = new Date();
        let expires = new Date(data[property.field]);
        expires = new Date(expires.getTime() + 3 * 60 * 60 * 1000);

        if (Number(data.validateAccount) === 1)
            return (<Text className=''></Text>);
        if (expires >= today)
            return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 rounded-lg bg-opacity-50'>Pendiente</Text>);
        if (expires < today)
            return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Rechazado</Text>);
    }

    if (property.field === 'resetPasswordExpires') {
        const today = new Date();
        if (data.resetPasswordExpires === null)
            return (<Text className=''></Text>);
        if (new Date(data[property.field]) <= today)
            return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 rounded-lg bg-opacity-50'>Pendiente</Text>);

        return (<Text className='p-1.5 text-xs font-medium uppercase tracking-wider text-red-800 bg-red-200 dark:bg-red-800 dark:text-red-200 rounded-lg bg-opacity-50'>Expirado</Text>);
    }

    return (<Text>{data[property.field]}</Text>);
}

const TablePDF = ({ header, data, info }) => {
    const ancho = 100 / header.length

    Font.register({
        family: 'Roboto', format: 'truetype', fonts: [
            { src: regular },
            { src: bold, fontWeight: 500 },
        ]
    });

    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
            fontFamily: 'Roboto',
            fontWeight: 400,
            color: '#222',
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        info: {
            fontSize: 12,
        },
        table: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

            margin: '0 auto',
            fontSize: 10,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            // flexWrap: 'wrap',
            width: '100%',
        },
        column: {
            // flex: `0 0 calc((100% / ${header.length + 1}) - 30)`,

            width: `${ancho}%`,
            backgroundColor: '#ffffff',
            // maxWidth: `calc((100% / ${header.length}) - 30px)`,
            // maxHeight: '50px',
            paddingLeft: '10px',
            textAlign: 'left',
            maxLines: 2,
        },
        columnEven: {
            // flex: `0 0 calc((100% / ${header.length + 1}) - 30)`,

            width: `${ancho}%`,
            backgroundColor: '#deedf0',
            // maxWidth: `calc((100% / ${header.length}) - 30px)`,
            // maxHeight: '50px',
            paddingLeft: '10px',
            textAlign: 'left',
            maxLines: 2,
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 10,
            marginVertical: 10,
            marginHorizontal: 35,
            borderTopWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#000',
            fontSize: 10,
        }
    });

    return (
        <Document fileName={info.title} >
            <Page size='A4' orientation='landscape' style={styles.body}>
                <View style={{ ...styles.header, paddingBottom: 20, borderBottomWidth: '2px', borderStyle: 'solid', borderColor: '#000', }} fixed>
                    <Image src={agLogo} alt='Logo AgSistemas' style={{ maxWidth: "90px", maxHeight: "90px" }} />

                    <Text style={{ alignSelf: 'flex-end', fontSize: 35, }} fixed>{info.title}</Text>

                    <View style={styles.info}>
                        <Text style={{ textTransform: 'uppercase', marginBottom: 1 }}>Reporte</Text>
                        <Text style={{ textTransform: 'uppercase', marginBottom: 1 }}>{info.title}</Text>
                        <Text style={{ marginBottom: 1 }}>Fecha: {info.ddmmaaaa} </Text>
                        <Text style={{ marginBottom: 1 }}>Hora: {info.hh_mm_ss} </Text>
                    </View>
                </View>


                <View style={styles.table} wrap>
                    <View style={{ ...styles.row, paddingTop: 20, fontWeight: 500, borderBottom: '2px solid #000' }} fixed>
                        {header.map((item, index) => {
                            return (<Text style={{ ...styles.column, ...item.style, fontWeight: 500 }} key={index}>{item.name}</Text>)
                        })}
                    </View>

                    {data.length !== 0
                        ? data.map((data, index) => {
                            const columnStyle = index % 2 === 0 ? styles.columnEven : styles.column
                            return (
                                <View style={styles.row} key={index}>
                                    {header.map((property, key) => <Text style={{ ...columnStyle, ...property.style }} key={key}><FormatDesktop data={data} property={property} /></Text>)}
                                </View>
                            )
                        }
                        )
                        : <View>
                            <Text>No hay entradas para mostrar</Text>
                        </View>
                    }
                </View>
                <View style={{ ...styles.footer }} fixed>
                    <Text style={{ textAlign: 'right' }} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
                    <Text style={{ position: 'absolute', bottom: 5, fontSize: 10, textAlign: 'center', left: '50%', transform: 'translateX(-50%)' }}>{`${info.receipt}_Reporte-${info.title}-PDF.pdf`}</Text>
                </View>
            </Page>
        </Document>
    )
}

export default TablePDF