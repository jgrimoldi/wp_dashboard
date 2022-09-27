import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { ContextAuth } from './contexts/ContextAuth';

ReactDOM.render(
    <React.StrictMode>
        <ContextAuth>
            <ContextProvider>
                <App />
            </ContextProvider>
        </ContextAuth>
    </React.StrictMode>,
    document.getElementById('root'),
);