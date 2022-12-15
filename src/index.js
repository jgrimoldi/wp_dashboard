import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { ContextAuth } from './contexts/ContextAuth';

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <ContextAuth>
                <ContextProvider>
                        <App />
                </ContextProvider>
            </ContextAuth>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);