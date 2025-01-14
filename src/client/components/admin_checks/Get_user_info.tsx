import axios from "axios";

// TYPE DEFINITIONS
export interface Types_user_info {
  email: string,
  is_admin: boolean,
}

export default async function get_user_info() {
  
  const user_info: Types_user_info  = {
    email: "",
    is_admin: false 
  };
 
  // FIND CURRENT USER
  try {
    const response = await axios.get("/user_info");
    const info = response.data;
    console.log("current user info: ", info);
    user_info.email = info;

    // CHECK IF THEY HAVE ADMIN PRIVLEDGES
      try {
        const response = await axios.get("/is_admin");
        console.log("is the user a admin? ", response.data)
        let is_admin; 
        if(response.data === 1){
          is_admin = true
        } else { 
          is_admin = false
        };
        console.log("is user admin? ", is_admin);
        user_info.is_admin = is_admin;

      } catch (error) {
            console.log('%cError fetching is admin: ', 'background-color:red',error);   
      }

    return user_info;
  } catch (error) {
    console.log('%cError fetching user info: ', 'background-color:red',error);    
  }

}
