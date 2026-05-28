import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/globals.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Data router (createBrowserRouter + RouterProvider) instead of the simpler
 * <BrowserRouter> component because we use `useBlocker` for the unsaved-
 * changes dialog on /profile, and useBlocker only works under a data router.
 *
 * The route tree intentionally has a single catch-all that mounts <App />.
 * App.tsx then owns the real route table via declarative <Routes>/<Route>,
 * which still works inside a data router. This keeps the migration cost low
 * and lets us add loaders/actions per route later without rewriting App.
 */
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
