import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <PrimeReactProvider>
        <App/>
    </PrimeReactProvider>
);
