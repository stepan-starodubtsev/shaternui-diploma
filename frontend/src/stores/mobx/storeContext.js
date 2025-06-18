import React, { createContext, useContext } from 'react';
import RootStore from './RootStore';

// Створюємо екземпляр RootStore
const rootStore = new RootStore();

// Створюємо React Context
export const StoreContext = createContext(rootStore);

// Створюємо хук для зручного доступу до стору з компонентів
export const useStore = () => {
    return useContext(StoreContext);
};