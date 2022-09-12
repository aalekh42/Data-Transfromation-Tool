import React, { useState } from 'react'
import { setHhData } from '../redux';
import {connect} from 'react-redux';

function Demo({hhData,name}) {
  const [user,setUser]= useState(name);
  return (
    <>
        <div>Username ,{name} </div>
        <h6>HH DATA:{hhData}</h6>
    </>
  )
}

//STEP 1(gets redux state as parameter and returns an object. So we can use this state as props)
const mapStateToProps = state =>{
    return{
        hhData:state.common.hhData, 
        name:state.common.name,
        //used here state.common because we have mentioned an object inside combinereducers of store.js(where common is for CommonReducer)
    }
}

//STEP 2 (Use dispatch as a paramter and returns a function. Here e can use action Creater methods will act as an props)
const mapDispatchToProps=dispatch=>{
    return{
        setHhData:()=>dispatch(setHhData())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Demo);