import { createSlice } from "@reduxjs/toolkit";

interface UserAuthState {
  accesstoken: string | null;
  user: null;
  authLoaded: boolean;
}

const initialState: UserAuthState = {
  accesstoken: null,
  user: null,
  authLoaded: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setuserAccessToken(state, action) {
      state.accesstoken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    logout(state) {
      state.accesstoken = null;
      state.user = null;
      state.authLoaded = false;
    }
  }
});

export const { setuserAccessToken, setUser, setAuthLoaded, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
