import { useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import GuestRoute from './components/shared/GuestRoute';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AuthPage from './features/auth/pages/AuthPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import LandingPage from './features/landing/pages/LandingPage';
import Layout from './layouts/Layout';

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: '/', element: <LandingPage /> },
          { path: '/login', element: <AuthPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/dashboard', element: <DashboardPage /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export default function App() {
  const [router] = useState(() => createBrowserRouter(routes));
  return <RouterProvider router={router} />;
}
