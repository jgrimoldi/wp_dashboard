import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, theme }) => {
    return (
        <Helmet>
            <meta name='theme-color' content={theme ? theme : '#FFFFFF'} />
            <meta name='description' content={description ? description : `${title} en AG Stock`} />
            <title>{title ? title : ''} · AG Stock</title>
        </Helmet>
    )
}

export default SEO