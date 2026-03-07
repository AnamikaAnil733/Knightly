
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BoardTheme {
  name: string;
  light: string;
  dark: string;
}

interface UIState {
  boardTheme: string;
}

const initialState: UIState = {
  boardTheme: "classic", // neon blue
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setBoardTheme(state, action: PayloadAction<string>) {
      state.boardTheme = action.payload;
    },
  },
});

export const { setBoardTheme } = uiSlice.actions;
export default uiSlice.reducer;
