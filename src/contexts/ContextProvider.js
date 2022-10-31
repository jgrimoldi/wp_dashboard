import React, { createContext, useContext, useState } from 'react';
import { themeColorsSetter } from '../data/dummy';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [activeNavbar, setActiveNavbar] = useState(true);
    const [loginNavbar, setLoginNavbar] = useState(false);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [themeColors, setThemeColors] = useState(themeColorsSetter[0].colors);
    const [currentMode, setCurrentMode] = useState('white');

    const setMode = (mode) => {
        const colorsByTheme = { 'dark': themeColorsSetter[1].colors, 'light': themeColorsSetter[0].colors }

        setCurrentMode(mode);
        setCurrentColor(colorsByTheme[mode].background);
        setThemeColors(colorsByTheme[mode]);

        localStorage.setItem('themeColors', JSON.stringify(colorsByTheme[mode]));
        localStorage.setItem('themeMode', mode);
    }

    return (
        <StateContext.Provider value={{ activeMenu, setActiveMenu, screenSize, setScreenSize, currentMode, currentColor, themeColors, setMode, activeNavbar, setActiveNavbar, loginNavbar, setLoginNavbar }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);