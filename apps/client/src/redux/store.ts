import { configureStore } from '@reduxjs/toolkit';
import { f1Api } from './f1api/f1api';
import racesReducer from './slices/racesSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            [f1Api.reducerPath]: f1Api.reducer,
            races: racesReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(f1Api.middleware),
        devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;