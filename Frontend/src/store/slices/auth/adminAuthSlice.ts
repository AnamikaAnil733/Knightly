import { createSlice } from "@reduxjs/toolkit";
const initialState= {
    accessToken: null,
    admin: null,
    authLoaded: false,
  };
  
  const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
      setAccessToken(state, action) {
        state.accessToken = action.payload;
      },
      setAdmin(state, action) {
        state.admin = action.payload;
      },
      setAuthLoaded(state, action) {
        state.authLoaded = action.payload;
      },
      logout(state) {
        state.accessToken = null;
        state.admin = null;
        state.authLoaded = false;
      },
    },
  });
export const {setAccessToken,setAuthLoaded,logout,setAdmin} = adminAuthSlice.actions;
export default adminAuthSlice.reducer;