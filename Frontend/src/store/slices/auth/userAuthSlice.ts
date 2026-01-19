import { createSlice , PayloadAction} from "@reduxjs/toolkit";
import { IUser } from "../../../types/user";

interface UserAuthState {
  accesstoken: string | null;
  user: IUser|null;
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
      state.authLoaded = true;
    },
    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

  }
});

export const { setuserAccessToken, setUser, setAuthLoaded, logout,updateUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;
