import * as types from "../constants/actionTypes";

const commonInitialState={
    hhData:null,
    name:'aalekh',
    aggregatedData:{},
    listItems:'',
}

export default function sessionReducer(state = commonInitialState, action) {
    switch (action.type) {
        case types.SET_HH_DATA:
            return { ...state, hhData: action.hhData };
        case types.SET_AGGREGATED_DATA:
            return{...state,aggregatedData:action.aggregatedData};
        default:
            return { ...state };
    }
}