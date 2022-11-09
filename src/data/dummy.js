import {
    BsColumnsGap,
    BsShop,
    BsPeople,
    BsBox,
    BsBoxSeam,
    BsRulers,
    BsTruck,
    BsTruckFlatbed,
    BsPiggyBank,
    BsWallet2,
    BsArrowLeftRight,
    BsBarChart,
    BsFileBarGraph,
    BsPersonPlus,
    BsGear,
    BsArrowRepeat,
    BsQuestionCircle,
    BsPersonLinesFill,
} from 'react-icons/bs';

export const regEx = {
    user: /^[a-zA-Z0-9_-]{4,16}$/,
    text: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*+.-])[A-Za-z\d#?!@$%^&*+.-]{8,}$/,
    uppercaseRegExp: /(?=.*?[A-Z])/,
    lowercaseRegExp: /(?=.*?[a-z])/,
    digitsRegExp: /(?=.*?[0-9])/,
    specialCharRegExp: /(?=.*?[#?!@$%^&*+.-])/,
    minLengthRegExp: /.{8,}/,
    notEmpty: /(.|\s)*\S(.|\s)*/,
    alphanumeric: /^[a-zA-Z0-9]*$/,
    alphanumericHyphen: /^$|^[a-fA-F0-9-:.]+$/
};

export const sidebar = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Dashboard',
                url: 'dashboard',
                icon: <BsColumnsGap />,
            },
        ],
    },
    {
        title: 'Almacén',
        links: [
            {
                name: 'Almacén',
                url: 'almacen',
                icon: <BsShop />,
            }
        ]
    },
    {
        title: 'Clientes',
        links: [
            {
                name: 'Clientes',
                url: 'clientes',
                icon: <BsPersonLinesFill />,
            }
        ]
    },
    {
        title: 'Productos',
        links: [
            {
                name: 'Productos',
                url: 'productos',
                icon: <BsBox />,
            },
            {
                name: 'Tipo de productos',
                url: 'tipo-de-productos',
                icon: <BsBoxSeam />,
            },
            {
                name: 'Unidad de medida',
                url: 'unidades-de-medida',
                icon: <BsRulers />,
            },
        ],
    },

    {
        title: 'Proveedores',
        links: [
            {
                name: 'Proveedores',
                url: 'proveedores',
                icon: <BsTruck />,
            },
            {
                name: 'Categoría',
                url: 'categoria-de-proveedores',
                icon: <BsTruckFlatbed />,
            },
        ],
    },

    {
        title: 'Movimientos',
        links: [
            {
                name: 'Compra de productos',
                url: 'ingresos',
                icon: <BsPiggyBank />,
            },
            {
                name: 'Egreso de productos',
                url: 'egresos',
                icon: <BsWallet2 />,
            },
            {
                name: 'Transferencia entre almacenes',
                url: 'transferencia-entre-almacenes',
                icon: <BsArrowLeftRight />,
            },
        ],
    },

    {
        title: 'Reportes',
        links: [
            {
                name: 'Estadisticas',
                url: '/', //estadisticas
                icon: <BsBarChart />,
            },
            {
                name: 'Reportes',
                url: '/', //reportes
                icon: <BsFileBarGraph />,
            },
        ],
    },

    {
        title: 'Administración',
        links: [
            {
                name: 'Registro de Usuarios',
                url: 'registro',
                icon: <BsPersonPlus />,
            },
            {
                name: 'Usuarios',
                url: 'empleados',
                icon: <BsPeople />,
            },
            {
                name: 'Backup',
                url: 'restaurar',
                icon: <BsArrowRepeat />,
            },
        ],
    },
    {
        title: 'Usuarios',
        links: [
            {
                name: 'Configuración',
                url: '/', //perfil
                icon: <BsGear />,
            },
            {
                name: 'Ayuda',
                url: '/', //ayuda
                icon: <BsQuestionCircle />,
            },
        ],
    },
];

export const themeColorsSetter = [
    {
        fk_theme: 1,
        name: 'Tema Claro',
        mode: 'light',
        hex: '#FFFFFF',
        secondary: 'black',
        colors: {
            background: '#FFFFFF',
            primary: '#161ECF',
            secondary: '#571CDD',
            confirm: '#224C24',
            error: '#B00020',
            highEmphasis: 'rgba(0, 0, 0, 0.87)',
            mediumEmphasis: 'rgba(0, 0, 0, 0.60)',
            disabled: 'rgba(0, 0, 0, 0.25)',
        },
    },
    {
        fk_theme: 2,
        name: 'Tema Oscuro',
        mode: 'dark',
        hex: '#121212',
        secondary: 'white',
        colors: {
            background: '#121212',
            primary: '#A2A5FA',
            secondary: '#C4A2FA',
            confirm: '#66BB6A',
            error: '#F39791',
            highEmphasis: 'rgba(255, 255, 255, 0.87)',
            mediumEmphasis: 'rgba(255, 255, 255, 0.60)',
            disabled: 'rgba(255, 255, 255, 0.38)',
        },
    },
    // {
    //     name: 'Tema Azul',
    //     mode: 'blue',
    //     hex: '#001D64',
    //     secondary: 'white',
    //     colors: {
    //         background: '#121212',
    //         primary: '#A2A5FA',
    //         secondary: '#C4A2FA',
    //         confirm: '#66BB6A',
    //         error: '#F39791',
    //         highEmphasis: 'rgba(255, 255, 255, 0.87)',
    //         mediumEmphasis: 'rgba(255, 255, 255, 0.60)',
    //         disabled: 'rgba(255, 255, 255, 0.38)',
    //     }
    // },
];

export const LinePrimaryXAxis = {
    valueType: 'DateTime',
    labelFormat: 'dd/MMM',
    intervalType: 'Days',
    rangePadding: 'Additional',
    majorGridLines: { width: 0 },
    labelStyle: {
        size: '10px'
    }
};

export const LinePrimaryYAxis = {
    labelFormat: '{value}ARS',
    rangePadding: 'Additional',
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    arrangeByIndex: true,
};

export const incomeGrid = [
    { name: 'Producto', field: 'product', mobile: 'product', },
    { name: 'Unidades', field: 'quantity', mobile: 'quantity', },
    { name: 'U.Med', field: 'units', mobile: 'units', },
    { name: 'P. Unit', field: 'unitPrice', mobile: 'unitPrice', },
    { name: 'Precio', field: 'price', mobile: 'price', },
    { name: 'Alicuota', field: 'alicuota', mobile: 'alicuota', },
    { name: 'Importe IVA', field: 'VAT', mobile: 'VAT', },
    { name: 'SubTotal', field: 'subTotal', mobile: 'subTotal', },
];

export const backupGrid = [
    { name: 'Creado por', field: 'createdBy', mobile: 'createdBy', },
    { name: 'Fecha', field: 'createdAt', mobile: 'createdAt', },
    { name: 'Nombre', field: 'nombre', mobile: 'size', },
    { name: 'Tamaño', field: 'size', mobile: 'nombre', },
    { name: 'Descargar', field: 'url', mobile: 'url', },
];

export const productsGrid = [
    { name: 'Producto', field: 'nombre', mobile: 'nombre', },
    { name: 'Tipo de Producto', field: 'tipoproducto', mobile: 'tipoproducto', },
    { name: 'Unidades', field: 'cantidad', mobile: 'cantidad', },
    { name: 'Unidad de medida', field: 'abreviatura', mobile: 'abreviatura', },
    { name: 'Stock Mínimo', field: 'stockmin', mobile: 'stockmin', },
    { name: 'Stock Máximo', field: 'stockmax', mobile: 'stockmax', },
    { name: 'Alicuota', field: 'alicuota', mobile: 'alicuota', },
    { name: 'Descripción', field: 'descripcion', mobile: 'descripcion', },
];

export const productsTypeGrid = [
    { name: 'Nombre Insumo', field: 'nombre', mobile: 'nombre', },
    { name: 'Descripción', field: 'descripcion', mobile: 'descripcion', },
];

export const unitsGrid = [
    { name: 'Magnitud', field: 'magnitud', mobile: 'magnitud', },
    { name: 'Abreviatura', field: 'abreviatura', mobile: 'abreviatura', },
];

export const categoryGrid = [
    { name: 'Nombre Insumo', field: 'nombre', mobile: 'nombre', },
    { name: 'Descripción', field: 'descripcion', mobile: 'descripcion', },
];

export const providersGrid = [
    { name: 'CUIT/CUIL', field: 'id', mobile: 'id', },
    { name: 'Categoria', field: 'categoria', mobile: 'categoria', },
    { name: 'Proveedor', field: 'nombre', mobile: 'nombre', },
    { name: 'Dirección', field: 'direccion', mobile: 'direccion', },
    { name: 'Código Postal', field: 'cp', mobile: 'cp', },
    { name: 'Teléfono', field: 'tel', mobile: 'tel', },
    { name: 'Correo', field: 'email', mobile: 'email', },
    { name: 'Observaciones', field: 'observaciones', mobile: 'observaciones', },
];

export const warehousesGrid = [
    { name: 'Almacén', field: 'nombre', mobile: 'nombre' },
    { name: 'Detalles', field: 'detalle', mobile: 'detalle' },
];

export const clientsGrid = [
    { name: 'CUIT/CUIL', field: 'id', mobile: 'id', },
    { name: 'Cliente', field: 'nombre', mobile: 'nombre', },
    { name: 'Dirección', field: 'direccion', mobile: 'direccion', },
    { name: 'Código Postal', field: 'cp', mobile: 'cp', },
    { name: 'Teléfono', field: 'tel', mobile: 'tel', },
    { name: 'Correo', field: 'email', mobile: 'email', },
    { name: 'Observaciones', field: 'observaciones', mobile: 'observaciones', },
];

export const usersGrid = [
    { name: 'Nombre', field: 'nombre', mobile: 'nombre', },
    { name: 'Apellido', field: 'apellido', mobile: 'apellido', },
    { name: 'Correo', field: 'email', mobile: 'email', },
    { name: 'Cuenta validada', field: 'validateAccount', mobile: 'validateAccount', },
    { name: 'Último inicio', field: 'lastlogin', mobile: 'lastlogin', },
];

export const employeesGrid = [
    { name: 'Nombre', field: 'nombre', mobile: 'nombre', },
    { name: 'Apellido', field: 'apellido', mobile: 'apellido', },
    { name: 'Correo', field: 'email', mobile: 'email', },
    { name: 'Cuenta validada', field: 'validateAccount', mobile: 'validateAccount', },
    { name: 'Pendiente de validación', field: 'validateAccountExpires', mobile: 'validateAccountExpires', },
    { name: 'Último inicio', field: 'lastlogin', mobile: 'lastlogin', },
    { name: 'Cambio de clave', field: 'resetPasswordExpires', mobile: 'resetPasswordExpires', },
    { name: 'Fecha de creación', field: 'createdAt', mobile: 'createdAt', },
];

export const barcodeGrid = [
    { name: 'Códigos de barra', field: 'codigodebarra', mobile: 'codigodebarra' },
];

export const serialNumberGrid = [
    { name: 'SN', field: 'sn', mobile: 'sn' },
    { name: 'mac1', field: 'mac1', mobile: 'mac1' },
    { name: 'mac2', field: 'mac2', mobile: 'mac2' },
    { name: 'mac3', field: 'mac3', mobile: 'mac3' },
    { name: 'en', field: 'en', mobile: 'en' },
];