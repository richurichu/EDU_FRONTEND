import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import rolesSlice from './Slices/rolesSlice';

const persistConfig = {
  key: 'root',
  storage,
 
};

const persistedReducer = persistReducer(persistConfig, rolesSlice);

const store = configureStore({
  reducer: {
    roles: persistedReducer
  }
});

export const persistor = persistStore(store);
export default store;