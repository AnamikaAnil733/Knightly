import { configureStore,combineReducers} from "@reduxjs/toolkit";
import userAuth from  "./slices/auth/userAuthSlice";
import adminAuth from "./slices/auth/adminAuthSlice";


import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// reducers that should persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth", "adminAuth"] // keep both logged-in after refresh
};

const rootReducer = combineReducers({
  userAuth,
  adminAuth,
});

// wrap reducer in persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedReducer,
});

// create persistor to use in index.tsx
export const persistor = persistStore(Store);

