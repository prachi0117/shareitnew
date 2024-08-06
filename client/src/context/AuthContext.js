import { createContext,useReducer,useEffect } from "react";
import AuthReducer from "./AuthReducer";
const INITIAL_STATE = {
    user:  JSON.parse(localStorage.getItem("user")) ||null,
    isFetching: false,
    error: false,
  };

  //JSON.parse(localStorage.getItem("user")) ||

  export const AuthContext = createContext(INITIAL_STATE)

  export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    
    useEffect(()=>{
      localStorage.setItem("user", JSON.stringify(state.user))
    },[state.user])


    return (
      <AuthContext.Provider
        value={{
          user: state.user,
          isFetching: state.isFetching,
          error: state.error,
          dispatch,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  //rijulrahul28


  /* 
    after clicking on login 1. dispatch action
    2.reducer it then decide which state to update
    3.update state
  */
  
    // _id:"66a614d27bd06b2bc9882c52",
        // username:"annie",
        // email:"ani@gmail.com",
        // profilePicture:"",
        // coverPicture:"",
        // isAdmin: false,
        // followers: [],
        // followings:Array (1)