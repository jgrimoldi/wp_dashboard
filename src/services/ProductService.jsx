import API, { header, URL_BARCODE, URL_PRODUCT, URL_PRODUCTTYPE, URL_UNIT } from './Api';

export const insertProduct = (fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, controlNS, descripcion, token) => {
    return (
        API.post(URL_PRODUCT, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, controlNS, stockmin, stockmax, imagen: 'imagen.jpg', descripcion }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const updateProductById = (id, fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, stockmin, stockmax, controlNS, descripcion, token) => {
    return (
        API.put(URL_PRODUCT + id, { fk_tipoproducto, fk_unidad, fk_alicuota, nombre, cantidad, controlNS, stockmin, stockmax, imagen: 'imagen.jpg', descripcion }, header(token))
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

export const updateProductTypeById = (id, nombre, descripcion, token) => {
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

export const updateUnitById = (id, magnitud, abreviatura, token) => {
    return (
        API.put(URL_UNIT + id, { magnitud, abreviatura }, header(token))
            .then(response => {
                return response.data;
            })
    )
}

export const insertBarCode = (fk_producto, codigodebarra, token) => (
    API.post(URL_BARCODE, { fk_producto, codigodebarra }, header(token))
        .then(response => {
            return response.data;
        })
)

export const updateBarcodeById = (id, fk_producto, codigodebarra, token) => (
    API.put(URL_BARCODE + id, { fk_producto, codigodebarra }, header(token))
        .then(response => {
            return response.data;
        })
)

export const findBarcodeByProduct = (fk_producto, token) => (
    API.get(URL_BARCODE + 'q/producto/' + fk_producto, header(token))
        .then(response => {
            return response.data;
        })
)