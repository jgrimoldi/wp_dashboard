import API, { header, URL_PRODUCT } from './Api';

export const insertProduct = (fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen, descripcion, token) => {
    return (
        API.post(URL_PRODUCT, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen, descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateProductById = (id, fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen, descripcion, token) => {
    return (
        API.put(URL_PRODUCT + id, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, imagen, descripcion }, header(token))
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