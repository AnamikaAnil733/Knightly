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

function App() {
  const dispatch = useDispatch();
  const { authLoaded } = useSelector(
    (state: RootState) => state.userAuth
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get("/user/profile");
        console.log(res)
        dispatch(setUser(res.data));                                                                                                                                                                                                                                              
      } catch {
        // not logged in → ignore
      } finally {
        dispatch(setAuthLoaded(true));
      }
    };

    initAuth();
  }, [dispatch]);

  if (!authLoaded) {
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
