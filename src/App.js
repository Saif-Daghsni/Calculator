import { useReducer } from "react";
import "./App.css"
import { type } from "@testing-library/user-event/dist/type";

const ACTIONS={
  ADD_DIGIT :"add-digit",
  CHOSSE_OPERATION : "chosse-operation",
  CLEAR : "clear",
  DELETE_DIGIT: "delet-digit",
  EVALUATE :"evaluate",
}

function DigitBotton({dispatch,digit}){
  return(
    <button 
    onClick={()=> dispatch({ type :ACTIONS.ADD_DIGIT,payload:{digit}})} 
    >
      {digit}
    </button>
  )
}

function OperationBotton({dispatch,operation}){
  return(
    <button 
    onClick={()=> dispatch({type : ACTIONS.CHOSSE_OPERATION,payload:{operation}})}
    >
      {operation}
    </button>
  )
}

function reducer(state,{ type , payload }){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)
        {
          return{
            ...state ,
            overwrite : false ,
            currentOperand : payload.digit,
          }
        }
      if(payload.digit ==="0" && state.currentOperand=="0")return state
      if(payload.digit ==="." && state.currentOperand.includes("."))return state
      return{
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    case ACTIONS.CHOSSE_OPERATION:
    if(state.currentOperand== null && state.previousOperand == null) return state  
    if(state.previousOperand== null){
      return{
        ...state,
        currentOperand: null,
        previousOperand: state.currentOperand,
        operation:payload.operation,
      }
    }
    return{
      ...state,
      currentOperand: null,
      previousOperand: evaluate(state),
      operation:payload.operation,
    }
    case ACTIONS.EVALUATE :
      if(state.operation == null || 
        state.previousOperand == null ||
        state.currentOperand == null 
      ){
        return state 
      }
      return{
        ...state,
        overwrite : true ,
        previousOperand: null ,
        operation : null ,
        currentOperand : evaluate(state),
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite:false,
          currentOperand:null
        }
      }
      if(state.currentOperand == null)return state
      if(state.currentOperand.length ==1)
        {
          return{
            ...state,
            currentOperand : null,
          }
        }

        return{
          ...state,
          currentOperand : state.currentOperand.slice(0,-1)
        }
    case ACTIONS.CLEAR:
      return{}
  }
}

function evaluate(state){
  const curr=parseFloat(state.currentOperand)
  const prev=parseFloat(state.previousOperand)
  let result="";
  if(isNaN(prev) || isNaN(curr)) return ""
  switch(state.operation){
    case "+" :
      result= prev + curr 
      break
    case "-" :
      result = prev - curr 
      break
    case "*" :
      result = prev * curr 
      break
    case "/" :
      result = prev / curr 
      break
    
  }
   return result.toString()
}


function App (){
  const[{previousOperand,currentOperand,operation},dispatch]=useReducer(reducer,{})
  
  return(
  
    <div className="claculator-grid">

      <div className="output">
        <div className="previous-operand">{previousOperand}{operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>


      <button className="span-two" onClick={() => dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationBotton operation="/" dispatch={dispatch}/>
      <DigitBotton digit="1" dispatch={dispatch}/>
      <DigitBotton digit="2" dispatch={dispatch}/>
      <DigitBotton digit="3" dispatch={dispatch}/>
      <OperationBotton operation="*" dispatch={dispatch}/>
      <DigitBotton digit="4" dispatch={dispatch}/>
      <DigitBotton digit="5" dispatch={dispatch}/>
      <DigitBotton digit="6" dispatch={dispatch}/>
      <OperationBotton operation="+" dispatch={dispatch}/>
      <DigitBotton digit="7" dispatch={dispatch}/>
      <DigitBotton digit="8" dispatch={dispatch}/>
      <DigitBotton digit="9" dispatch={dispatch}/>
      <OperationBotton operation="-" dispatch={dispatch}/>
      <DigitBotton digit="." dispatch={dispatch}/>
      <DigitBotton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.EVALUATE})}>=</button>

    </div>
  ) 
}

export default App ;