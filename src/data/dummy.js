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
]