import axios from "axios";
import { useContext, useEffect, useState } from "react";

// CONTEXT IMPORTS
import { Use_Context_User_Info } from '../user_info/Context_user_info.js';

// STYLE IMPORTS
import { log_colors } from "../../styles/log_colors.js";

// TYPE DEFINITIONS
import { Types_user_info } from "../user_info/Context_user_info.js";


// THE COMPONENT
export default function useGetUserInfo() {

  let values:Types_user_info = {
    email: "",
    is_admin: false
  };

  // Update_Context for user info
  const update_user_info = useContext(Use_Context_User_Info).update_func;

  
  // FIND CURRENT USER
  async function get_info(){
    console.log(`%c HOOK `, `background-color:${ log_colors.hook }`,`for getUserInfo`, '\n' , );

    try {
      const response = await axios.get("/user_info");
      const data = response.data;
 
          let user_is_admin; 
          if(data.is_admin === 1){
            user_is_admin = true
          } else { 
            user_is_admin = false
          };

          values = {
            email: data.email,
            is_admin: data.is_admin
          }

          update_user_info(values);

    } catch (error) {
      console.log('%cError fetching user info: ', 'background-color:darkred',error);    
    }
  }
  useEffect(() => {
    get_info()
  },[])

 
}
