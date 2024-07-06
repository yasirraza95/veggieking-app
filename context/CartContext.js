// CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCounter, setCartCounter] = useState(0);
    const [userAddress, setUserAddress] = useState("");

    const updateCartCounter = (count) => {
        setCartCounter(count);
    };

    const updateUserAddress = (address) => {
        setUserAddress(address);
    };

    return (
        <CartContext.Provider value={{ cartCounter, updateCartCounter, userAddress, updateUserAddress }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
