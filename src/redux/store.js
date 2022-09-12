import {applyMiddleware, combineReducers, createStore} from "redux";
import commonReducer from "./reducers/commonReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from "redux-logger";

const rootReducer=combineReducers({
    common:commonReducer
})
const store=createStore(rootReducer,composeWithDevTools(applyMiddleware(logger)));
// const store=createStore(CardReducer);

export default store;