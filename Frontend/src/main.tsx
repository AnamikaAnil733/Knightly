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
const ClintId = import.meta.env.VITE_GOOGLE_CLIENT_ID 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store= {Store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId={ClintId}>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </GoogleOAuthProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
