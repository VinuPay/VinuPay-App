import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'setimmediate';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import {Toaster} from 'react-hot-toast';
import themes from './themes.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ManageTab from './pages/ManageTab.jsx';
import MainTab from './pages/MainTab.jsx';
import NotFoundTab from './pages/404.jsx';
import MintTab from './pages/MintTab.jsx';
import NameLookupTab from './pages/NameLookupTab.jsx';
import CreateInvoiceTab from './pages/CreateInvoiceTab';
import InvoiceLookupTab from './pages/InvoiceLookupTab';
import {EventEmitter} from 'events';
import PayInvoiceTab from './pages/PayInvoiceTab';
export const themeChange = new EventEmitter();
// --- Router ---
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/manage',
    element: <ManageTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/mint',
    element: <MintTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/nameLookup',
    element: <NameLookupTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/createInvoice',
    element: <CreateInvoiceTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/invoiceLookup',
    element: <InvoiceLookupTab/>,
    errorElement: <NotFoundTab/>,
  },
  {
    path: '/payInvoice',
    element: <PayInvoiceTab/>,
    errorElement: <NotFoundTab/>,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>,
);
function App() {
  const [currentTheme, setCurrentTheme] = React.useState(themes[0]);
  React.useEffect(() => {
    const theme = getCookie('theme');
    if (theme) {
      // Find theme in array of themes
      const themeIndex = themes.findIndex((t) => t.name === theme);
      if (themeIndex !== -1) {
        setCurrentTheme(themes[themeIndex]);
      } else {
        setCurrentTheme(themes[0]);
      }
    }
    themeChange.on('themeChange', themeChangeEvent);
    if (!theme) {
      document.cookie = 'theme=Nox';
    }
    return () => {
      themeChange.off('themeChange', themeChangeEvent);
    };
  }, []);
  const themeChangeEvent = (theme) => {
    document.cookie = `theme=${theme}`;
    setCurrentTheme(themes.find((t) => t.name === theme));
  };
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline enableColorScheme/>

      <RouterProvider router={router}>
      </RouterProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '20px',
            borderRadius: '50px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </ThemeProvider>
  );
}
// https://stackoverflow.com/a/15724300
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
