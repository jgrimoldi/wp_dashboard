import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    add: false,
    delete: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [currentMode, setCurrentMode] = useState('dark');

    const setMode = (mode, color) => {
        setCurrentMode(mode);
        setCurrentColor(color);

        console.log(mode, color);

        localStorage.setItem('themeColor', color);
        localStorage.setItem('themeMode', mode);
    }

    const handleClick = (clicked) => {
        setIsClicked({ ...initialState, [clicked]: true });
    }

    return (
        <StateContext.Provider value={{ activeMenu, setActiveMenu, isClicked, setIsClicked, screenSize, setScreenSize, handleClick, currentMode, currentColor, setMode }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);