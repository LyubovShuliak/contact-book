import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './ContactsSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
