import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Store, persistor } from "./store/store";
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store= {Store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId="505026105678-uvtloja7ekdiroain4q0t1v6km9k4ej5.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </GoogleOAuthProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
