import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'setimmediate';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import {Toaster} from "react-hot-toast";
import {lightTheme, darkTheme} from "./themes.jsx";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ManageTab from "./pages/ManageTab.jsx";
import MainTab from "./pages/MainTab.jsx";
import NotFoundTab from "./pages/404.jsx";
import MintTab from "./pages/MintTab.jsx";
import NameLookupTab from "./pages/NameLookupTab.jsx";
import CreateInvoiceTab from "./pages/CreateInvoiceTab";

// --- Router ---
export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainTab/>,
        errorElement: <NotFoundTab/>,
    },
    {
        path: "/manage",
        element: <ManageTab/>,
        errorElement: <NotFoundTab/>,
    },
    {
        path: "/mint",
        element: <MintTab/>,
        errorElement: <NotFoundTab/>,
    },
    {
        path: "/nameLookup",
        element: <NameLookupTab/>,
        errorElement: <NotFoundTab/>,
    },
    {
        path: "/createInvoice",
        element: <CreateInvoiceTab/>,
        errorElement: <NotFoundTab/>,
    },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
      <ThemeProvider theme={darkTheme}>
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
)
