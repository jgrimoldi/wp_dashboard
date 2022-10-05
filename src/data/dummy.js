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
} from 'react-icons/bs';

export const regEx = {
    user: /^[a-zA-Z0-9_-]{4,16}$/,
    text: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+@$!%*?&_])[A-Za-z\d@$!%*?+&_]{8,}$/,
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
            {
                name: 'Almacén',
                url: 'almacen',
                icon: <BsShop />,
            },
            {
                name: 'Clientes',
                url: 'clientes',
                icon: <BsPeople />,
            }
        ],
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
                url: 'estadisticas',
                icon: <BsBarChart />,
            },
            {
                name: 'Reportes',
                url: 'reportes',
                icon: <BsFileBarGraph />,
            },
        ],
    },

    {
        title: 'Administración',
        links: [
            {
                name: 'Registro de usuarios',
                url: 'registro',
                icon: <BsPersonPlus />,
            },
            {
                name: 'Configuración',
                url: 'perfil',
                icon: <BsGear />,
            },
            {
                name: 'Backup',
                url: 'restaurar',
                icon: <BsArrowRepeat />,
            },
            {
                name: 'Ayuda',
                url: 'ayuda',
                icon: <BsQuestionCircle />,
            },
        ],
    },
];

export const themeColors = [
    {
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
    {
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
        name: 'Tema Azul',
        mode: 'blue',
        hex: '#001D64',
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
        }
    },
];

export const gridOrderImage = (props) => (
    <div>
        <img
            className="rounded-xl h-20 md:ml-3"
            src={props.ProductImage}
            alt="order-item"
        />
    </div>
);

export const categoryGrid = [
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Name',
        headerText: 'Nombre Insumo',
        width: '150',
        editType: 'dropdownedit',
        textAlign: 'Center',
    },
    {
        field: 'Description',
        headerText: 'Descripción',
        width: '150',
        textAlign: 'Left',
    },
];

export const providersGrid = [
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Category',
        headerText: 'Categoria',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Name',
        headerText: 'Nombre',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Address',
        headerText: 'Dirección',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Zip',
        headerText: 'Código Postal',
        width: '100',
        textAlign: 'Center',
    },
    {
        field: 'Phone',
        headerText: 'Teléfono',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Email',
        headerText: 'Correo',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Description',
        headerText: 'Observaciones',
        width: '150',
        textAlign: 'Left',
    },
];

export const clientsGrid = [
    { type: 'checkbox', width: '50' },
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Name',
        headerText: 'Nombre',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Address',
        headerText: 'Dirección',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Zip',
        headerText: 'Código Postal',
        width: '100',
        textAlign: 'Center',
    },
    {
        field: 'Phone',
        headerText: 'Teléfono',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Email',
        headerText: 'Correo',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Description',
        headerText: 'Observaciones',
        width: '150',
        textAlign: 'Left',
    },
];

export const incomeGrid = [
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Product',
        headerText: 'Nombre del producto',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Amount',
        headerText: 'Cantidad',
        width: '150',
        textAlign: 'Center',
        editType: 'numericedit',
    },
    {
        field: 'Price',
        headerText: 'Precio',
        width: '100',
        textAlign: 'Center',
        editType: 'numericedit',
    },
    {
        field: 'Partial',
        headerText: 'Parcial',
        width: '150',
        textAlign: 'Center',
        editType: 'numericedit',
    },
    {
        field: 'Partial',
        headerText: 'Parcial',
        width: '150',
        textAlign: 'Center',
        editType: 'numericedit',
    },
    // IVA, Unidad de medida, Abreviatura, SN, TotalIva, TotalCompra
];

export const backupGrid = [
    {
        name: 'ID',
        field: 'id',
        mobile: 'id',

    },
    {
        name: 'Creado por',
        field: 'createdBy',
        mobile: 'createdBy',

    },
    {
        name: 'Nombre',
        field: 'nombre',
        mobile: 'size',

    },
    {
        name: 'Tamaño',
        field: 'size',
        mobile: 'nombre',

    },
    {
        name: 'Descargar',
        field: 'url',
        mobile: 'url',

    }
];

export const productsGrid = [
    {
        name: 'ID',
        field: 'id',
        mobile: 'id',
    },
    {
        name: 'Código de Barra',
        field: 'codigodebarra',
        mobile: 'codigodebarra',
    },
    {
        name: 'Imagen',
        field: 'imagen',
        mobile: 'imagen',
    },
    {
        name: 'Producto',
        field: 'nombre',
        mobile: 'nombre',
    },
    {
        name: 'Tipo de Producto',
        field: 'tipoproducto',
        mobile: 'tipoproducto',
    },
    {
        name: 'Unidad',
        field: 'abreviatura',
        mobile: 'abreviatura',
    },
    {
        name: 'Descripción',
        field: 'descripcion',
        mobile: 'descripcion',
    },
    {
        name: 'Alicuota',
        field: 'alicuota',
        mobile: 'alicuota',
    },
    {
        name: 'Cantidad',
        field: 'cantidad',
        mobile: 'cantidad',
    },
    {
        name: 'Stock Mínimo',
        field: 'stockmin',
        mobile: 'stockmin',
    },
    {
        name: 'Stock Máximo',
        field: 'stockmax',
        mobile: 'stockmax',
    },
];

export const productsTypeGrid = [
    {
        name: 'ID',
        field: 'id',
        mobile: 'id',
    },
    {
        name: 'Nombre Insumo',
        field: 'nombre',
        mobile: 'nombre',
    },
    {
        name: 'Descripción',
        field: 'descripcion',
        mobile: '',
    },
    {
        name: '',
        field: '',
        mobile: 'descripcion',
    },
];

export const unitsGrid = [
    {
        name: 'ID',
        field: 'id',
        mobile: 'id',
    },
    {
        name: 'Magnitud',
        field: 'magnitud',
        mobile: 'magnitud',
    },
    {
        name: 'Abreviatura',
        field: 'abreviatura',
        mobile: 'abreviatura',
    },
];