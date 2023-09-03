import { all } from 'redux-saga/effects';
import authSaga from "./features/authentication/authSaga";

export default function* rootSaga() {
    yield all([ authSaga() ])
}