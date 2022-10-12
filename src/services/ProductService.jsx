import API, { header, URL_PRODUCT, URL_PRODUCTTYPE, URL_UNIT } from './Api';

export const insertProduct = (fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, descripcion, token) => {
    return (
        API.post(URL_PRODUCT, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen: 'imagen.jpg', descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateProductById = (id, fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, descripcion, token) => {
    return (
        API.put(URL_PRODUCT + id, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen: 'imagen.jpg', descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const getProductByDescription = (descripcion, token) => {
    return (
        API.get(URL_PRODUCT + 'q/descripcion/' + descripcion, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const getProductByBarCode = (codigodebarras, token) => {
    return (
        API.get(URL_PRODUCT + 'q/codigodebarras/' + codigodebarras, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertProductType = (nombre, descripcion, token) => {
    return (
        API.post(URL_PRODUCTTYPE, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateProductType = (id, nombre, descripcion, token) => {
    return (
        API.put(URL_PRODUCTTYPE + id, { nombre, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertUnit = (magnitud, abreviatura, token) => {
    return (
        API.post(URL_UNIT, { magnitud, abreviatura }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateUnit = (id, magnitud, abreviatura, token) => {
    return (
        API.put(URL_UNIT + id, { magnitud, abreviatura }, header(token))
            .then(response => {
                return response.data;
            })
    )
}