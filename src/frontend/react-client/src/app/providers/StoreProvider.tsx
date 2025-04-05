import { Provider } from 'react-redux';
import { persistor, store } from '../store';
import { PersistGate } from 'redux-persist/integration/react';

export const StoreProvider = ({ children }: any) => (
    <Provider store={store}>
         {children}
    </Provider>
);