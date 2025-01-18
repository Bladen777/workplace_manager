import axios from "axios";
import { useEffect, useState } from "react";

// TYPE DEFINITIONS
export interface Types_user_info {
  email: string,
  is_admin: boolean,
}


// THE COMPONENT
export default function useGetUserInfo() {
  
  const [user_info, set_user_info] = useState<Types_user_info>({
    email: "",
    is_admin: false
  }) 

 
  async function get_info(){
  // FIND CURRENT USER
    try {
      const response = await axios.get("/user_info");
      const user_email = response.data;

      // CHECK IF THEY HAVE ADMIN PRIVLEDGES
        try {
          const response = await axios.get("/is_admin");
          console.log("is the user a admin? ", response.data)
          let user_is_admin; 
          if(response.data === 1){
            user_is_admin = true
          } else { 
            user_is_admin = false
          };
          console.log(`The current user: ${user_email} ${user_is_admin ? 'is a admin' : 'is not a admin'}`)

          set_user_info({
            email: user_email,
            is_admin: user_is_admin
          })
        } catch (error) {
              console.log('%cError fetching is_admin: ', 'background-color:red',error);   
        }
    } catch (error) {
      console.log('%cError fetching user info: ', 'background-color:red',error);    
    }
  }
  useEffect(() => {
    get_info()
  },[])

  return user_info;
}
