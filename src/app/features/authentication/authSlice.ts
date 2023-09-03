import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from '../../../model/Account'
import type { RootState } from "../../store";

interface AuthState {
    isLoggedIn : boolean
    isLogging?: boolean
    currentUser?: Account,
    isLoginSuccess?: boolean,
    isLogoutSuccess?: boolean,
}

export interface LoginPayload {
    // username: string,
    email: string,
    password: string,
}

const initialState: AuthState = {
    isLoggedIn : false,
    isLogging: false,
    currentUser: undefined,
    isLoginSuccess: false,
    isLogoutSuccess: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.isLogging = true;
        },
        loginSuccess: (state, action: PayloadAction<Account>) => {
            state.isLoggedIn = true;
            state.isLogging = false;
            state.currentUser = action.payload; 
            state.isLoginSuccess = true;
            state.isLogoutSuccess = false; 
        },
        loginFailed: (state) => {
            state.isLogging = false;
        }, 
        logout: (state) => {
            state.isLoggedIn = false;
            state.currentUser = undefined;
            state.isLogoutSuccess = true;
            state.isLoginSuccess = false;
            state.isLogging = false;
        },
    },
});

export const authActions = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn 

export const selectCurrentUser = (state: RootState) => state.auth.currentUser

const authReducer = authSlice.reducer;
export default authReducer;