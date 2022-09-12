import * as types from "../constants/actionTypes";

const commonInitialState={
    hhData:null,
    name:'aalekh'
}

export default function sessionReducer(state = commonInitialState, action) {
    switch (action.type) {
        case types.SET_HH_DATA:
            return { ...state, hhData: action.hhData };

        default:
            return { ...state };
    }
}