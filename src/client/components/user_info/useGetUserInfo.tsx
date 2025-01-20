import axios from "axios";
import { useEffect, useState } from "react";

import { Update_Context_User_Info } from '../user_info/Context_user_info.js';

// TYPE DEFINITIONS
import { Types_user_info } from "../user_info/Context_user_info.js";


// THE COMPONENT
export default function useGetUserInfo() {

  

  let values:Types_user_info = {
    email: "",
    is_admin: false
  };

   // Update_Context for user info
   const update_user_info = Update_Context_User_Info(values);

  async function get_info(){
  // FIND CURRENT USER
    try {
      const response = await axios.get("/user_info");
      const data = response.data;

      console.log("The returned user data: ", data);
 
          let user_is_admin; 
          if(data.is_admin === 1){
            user_is_admin = true
          } else { 
            user_is_admin = false
          };
          console.log(`The current user: ${data.email} ${user_is_admin ? 'is a admin' : 'is not a admin'}`)

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
