import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import axios from "./Service/api/axios/Useraxios";
import AppRoutes from "./routes/AppRoutes";
import FullScreenLoader from "./components/FullScreenLoader";

import { RootState } from "./store/store"
import {
  setUser,
  setAuthLoaded,
} from "./store/slices/auth/userAuthSlice";


import {
  setAccessToken as setAdminAccessToken,
  setAuthLoaded as setAdminAuthLoaded,
} from "./store/slices/auth/adminAuthSlice";


function App() {
  const dispatch = useDispatch();
 

  useEffect(() => {
    const initAuth = async () => {
      try {
        // USER AUTH CHECK
        const userRes = await axios.get("/user/profile");
        dispatch(setUser(userRes.data));
      } catch {
        console.log("User not logged in");
      } finally {
        dispatch(setAuthLoaded(true));
      }
  
      try {
        // ADMIN AUTH CHECK
        const adminToken = localStorage.getItem("adminAccessToken");
  
        if (adminToken) {
          dispatch(setAdminAccessToken(adminToken));
        }
      } catch {
        console.log("Admin not logged in");
      } finally {
        dispatch(setAdminAuthLoaded(true));
      }
    };
  
    initAuth();
  }, [dispatch]);
  
  const userLoaded = useSelector(
    (state: RootState) => state.userAuth.authLoaded
  );
  
  const adminLoaded = useSelector(
    (state: RootState) => state.adminAuth.authLoaded
  );
  
  if (!userLoaded || !adminLoaded) {
    return <FullScreenLoader />;
  }
  

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  );
}

export default App;
