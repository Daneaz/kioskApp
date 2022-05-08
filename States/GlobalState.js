import React, { createContext, useReducer } from "react";
import { CN, EN, RESET, START, TICK } from "../Constants/Constant";

export const GlobalContext = createContext();

const initialState = { time: 300, isRunning: false, language: EN };

const reducer = (state, action) => {
  switch (action.type) {
    case START:
      return { ...state, isRunning: true };
    case RESET:
      return { ...state, isRunning: false, time: 300 };
    case TICK:
      return { ...state, time: state.time - 1 };
    case CN:
      return { ...state, language: CN };
    case EN:
      return { ...state, language: EN };
    default:
      return {
        state,
      };
  }
};

export const GlobalContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {props.children}
    </GlobalContext.Provider>
  );
};
