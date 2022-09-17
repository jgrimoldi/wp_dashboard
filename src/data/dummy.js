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
    BsBoxArrowLeft
} from 'react-icons/bs';

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
            {
                name: 'Cerrar Sesión',
                url: 'logout',
                icon: <BsBoxArrowLeft />,
            },
        ],
    },
];

export const themeColors = [
    {
        name: 'Tema Oscuro',
        mode: 'dark',
        hex: '#000000',
        secondary: 'white',
    },
    {
        name: 'Tema Claro',
        mode: 'light',
        hex: '#FFFFFF',
        secondary: 'black',
    },
    {
        name: 'Tema Azul',
        mode: 'blue',
        hex: '#001D64',
        secondary: 'white',
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

export const productsGrid = [
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Type',
        headerText: 'Tipo de Producto',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Unit',
        headerText: 'Unidad',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Alicuota',
        headerText: 'Alicuota',
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
        field: 'Quantity',
        headerText: 'Cantidad',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Min',
        headerText: 'Stock Mínimo',
        width: '150',
        textAlign: 'Center',
    },
    {
        field: 'Max',
        headerText: 'Stock Máximo',
        width: '150',
        textAlign: 'Center',
    },
    {
        headerText: 'Imagen',
        template: gridOrderImage,
        textAlign: 'Center',
        width: '120',
    },
    {
        field: 'Description',
        headerText: 'Descripción',
        width: '150',
        textAlign: 'Left',
    },
];

export const productsTypeGrid = [
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

export const unitsGrid = [
    {
        field: 'Code',
        headerText: 'Código ID',
        width: '80',
        textAlign: 'Center',
    },
    {
        field: 'Size',
        headerText: 'Magnitud',
        width: '150',
        editType: 'dropdownedit',
        textAlign: 'Center',
    },
    {
        field: 'Abbreviation',
        headerText: 'Abreviatura',
        width: '150',
        textAlign: 'Center',
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