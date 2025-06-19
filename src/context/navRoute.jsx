import React, { createContext, useContext, useState } from "react";

const NavChangeContext = createContext(); 


export const useNavRoute = () => useContext(NavChangeContext);




export const NavChangeProvider = ({ children }) => {

  const [activeNavRoute, setActiveNavRoute] = useState(null); 
  // console.log(activeNavRoute)
   
  const handleNavRoute = (name) => {
    setActiveNavRoute(name);
  };
  
  const [openLogin, setOpenLogin] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [liveUpcome, setLiveUpcome] = useState("live");
  
    const handleOpenLogin = () => {
      setOpenLogin(true);
      setOpenSignUp(false);
    };
    const handleOpenSignup = () => {
      setOpenSignUp(true);
      setOpenLogin(false);
    };
    const handleClose = () => {
      setOpenLogin(false);
      setOpenSignUp(false);
    };
  // console.log(activeNavRoute);

  return (
    <NavChangeContext.Provider value={{ activeNavRoute, setActiveNavRoute, handleNavRoute ,handleOpenLogin,handleOpenSignup,handleClose,openLogin,openSignUp,liveUpcome,setLiveUpcome}}>
      {children}
    </NavChangeContext.Provider>
  );
};
