import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { delay, call, put, take, fork } from "redux-saga/effects";
import { BASE_URL } from "../../../api/axiosClient";
import { Account } from "../../../model/Account";
import { authActions, LoginPayload } from "./authSlice";
import Cookies from 'js-cookie';

function* handleLogin(action: PayloadAction<LoginPayload>): any {
    try {
        yield delay(1000);
        let account: Account = {
            id: undefined,
            username: '',
            email: '',
            jwt: '',
            role: undefined,
        };
        let jwt = "";
        let errorMessage = "";
        // do somethinbg with axios login and dispatch actions
        yield axios.post(`${BASE_URL}/auth/local`, {
            identifier: action.payload.email,
            password: action.payload.password,
        }).then((res) => {
            jwt = res.data.jwt;
            account.id = res.data.user.id;
            account.email = res.data.user.email;
            account.username = res.data.user.username;
            account.jwt = jwt;
            account.role = res.data.user.role;
        }).catch(error => {
            console.log(error);
            errorMessage = error.response.data.error.message;
            toast.error(errorMessage);
        });

        if (jwt && account.role === 'admin') {
            // toast.show(ToastProps('Đăng nhập thành công.'));
            if (account.id) {
                Cookies.set('auth', jwt);
                yield put(authActions.loginSuccess(account));
            }
        }
        else {
            if (account.role !== 'admin') {
                toast.error('Đăng nhập thất bại');
            }
            yield put(authActions.loginFailed());
        }
    } catch (error) {
        console.log(error);
    }
}

function* handleLogout() {
    delay(500);
    Cookies.remove('auth');
    localStorage.clear();
    delay(1000);
}

// watcher: redux-saga glossary 
function* watcher (): any {
    while(true) {
        const jwt = Cookies.get('auth');
    
        if (!jwt) {
            const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
            yield fork(handleLogin, action);
        }

        const action: PayloadAction<any> = yield take([
            authActions.loginFailed.type,
            authActions.logout.type,
        ]);

        if (action.type === 'auth/logout') {
            yield call(handleLogout);
        } else if (action.type === 'auth/updateUserProfile') {
            yield take([
                authActions.logout.type,
            ]);
        }
    }
}

// task: redux saga glossary
export default function* authSaga() {
    yield fork(watcher);
}

