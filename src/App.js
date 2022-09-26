import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { HomeNavigation } from './components';
import './App.css';


const App = () => {

  return (
    <div>
      <BrowserRouter>
        <HomeNavigation />
      </BrowserRouter>
    </div>
  )
}

export default App