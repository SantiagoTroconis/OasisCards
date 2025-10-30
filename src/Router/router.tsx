import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../Pages/Dashboard';
import { RootLayout } from '../Layout/RootLayout';
import { ExplorarFutbol } from '../Pages/ExplorarFutbol';
import { ExplorarFormula1 } from '../Pages/ExplorarFormula1';
import { Partido } from '../Pages/Partido';
import { Login } from '../Pages/Login';
import { Register } from '../Pages/Register';
import { Profile } from '../Pages/Profile';
import { Landing } from '../Pages/Landing.tsx';
import { Marketplace } from '../Pages/Marketplace.tsx';
import { Seleccion } from '../Pages/Seleccion.tsx';
import { BattlePage } from '../Pages/Battle.tsx';

export const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
        ],
    },
    {
        path: '/explorar',
        element: <RootLayout />,
        children: [
            {
                path: 'futbol',
                element: <ExplorarFutbol />,
            },
            {
                path: 'formula-1',
                element: <ExplorarFormula1 />,
            }
        ],
    },
    {
        path: '/partido/:id',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Partido />,
            }
        ]
    },
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: '/seleccion/:pais',
                element: <Seleccion />,
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/profile',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Profile />,
            }
        ]
    },
    {
        path: '/marketplace',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Marketplace />,
            }
        ]
    },
    {
        path: '/battle',
        element: <BattlePage />
    }
]);