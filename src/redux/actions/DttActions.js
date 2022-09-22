import {SET_HH_DATA,SET_AGGREGATED_DATA} from '../constants/actionTypes'

export const setHhData=(hhData)=>{
    return{
        type:SET_HH_DATA,
        hhData
    }
}

export const setAggregatedData=(aggregatedData)=>{
    return{
        type:SET_AGGREGATED_DATA,
        aggregatedData
    }
}