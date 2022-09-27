import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    add: false,
    delete: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [activeNavbar, setActiveNavbar] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);

    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [themeColors, setThemeColors] = useState({});
    const [currentMode, setCurrentMode] = useState('dark');

    const setMode = (mode, colors) => {
        setCurrentMode(mode);
        setCurrentColor(colors.background);
        setThemeColors(colors);

        localStorage.setItem('themeColors', JSON.stringify(colors));
        localStorage.setItem('themeMode', mode);
    }

    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

    return (
        <StateContext.Provider value={{ activeMenu, setActiveMenu, isClicked, setIsClicked, screenSize, setScreenSize, handleClick, currentMode, currentColor, themeColors, setMode, activeNavbar, setActiveNavbar }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);