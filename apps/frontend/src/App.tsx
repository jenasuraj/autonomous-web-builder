import { createBrowserRouter, RouterProvider } from 'react-router';
import LandingPage from './features/landing/pages/LandingPage';
import Layout from './layouts/Layout';

const router = createBrowserRouter([
  { element: <Layout />, children: [{ path: '/', element: <LandingPage /> }] },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
