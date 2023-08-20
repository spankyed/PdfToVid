import { createContext } from 'react';
import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { store } from './shared/store';
import router from './shared/routes'
import './index.css';

export const StoreContext = createContext(store);

const theme = createTheme({
  typography: {
    // fontFamily: 'Courier New, monospace',
    // fontFamily: 'Tahoma, sans-serif',
    // fontFamily: 'Roboto, sans-serif',
    // fontFamily: 'Trebuchet MS, sans-serif',
    // fontFamily: 'Roboto, monospace',
  },
});

const App: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
      </StoreContext.Provider>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);