import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [activeNavbar, setActiveNavbar] = useState(true);
    const [loginNavbar, setLoginNavbar] = useState(false);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [themeColors, setThemeColors] = useState({});
    const [currentMode, setCurrentMode] = useState('white');

    const setMode = (mode, colors) => {
        setCurrentMode(mode);
        setCurrentColor(colors.background);
        setThemeColors(colors);

        localStorage.setItem('themeColors', JSON.stringify(colors));
        localStorage.setItem('themeMode', mode);
    }

    return (
        <StateContext.Provider value={{ activeMenu, setActiveMenu, screenSize, setScreenSize, currentMode, currentColor, themeColors, setMode, activeNavbar, setActiveNavbar, loginNavbar, setLoginNavbar }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);