import { useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import GuestRoute from './features/auth/GuestRoute';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AuthPage from './features/auth/AuthPage';
import DashboardPage from './features/dashboard/DashboardPage';
import LandingPage from './features/landing/LandingPage';
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
