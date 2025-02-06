import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import env from "dotenv";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import bodyParser from "body-parser";
import pg from "pg"

// DATABASE IMPORTS
import {local_db} from "./local_db.js"
import { render_db } from "./render_db.js";


// *** INITIAL SET UPS ***
  const app = express();
  env.config();
  const PORT:string = process.env.LOCAL_PORT!;
  app.use(express.json());
  app.use(bodyParser.urlencoded({extended: true}));


// *** CONNECT TO DATABASE ***
  let db: pg.Client | pg.Pool;
  if(local_db){ 
    db = local_db;
  } else {
    db = render_db;
  };
  
  try {
    db.connect();
  } catch (error) {
    console.log(`Error a suitable Database does not exist: `,error);
  }

// *** LOGIN START ***
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 10
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/auth/google",
    passport.authenticate("google",{
      scope: ["profile", "email"],
    })
  );

  app.get("/auth/google/home",
    passport.authenticate("google",{
      successRedirect:"/home",
      failureRedirect: "/landing"
    }),
  );

  // GOOGLE STRATEGY FOR LOGIN
  passport.use(
    "google",
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/home"
    },
    (accessToken, refreshToken, profile, done) => {

      // NEW USER
        // open a form to set their name 
        // also set admin value to zero
      const email: string = profile.email;
      return done(null, email); 
    }
  ));

  passport.serializeUser((user, cb) => {
  cb(null, user);
  });

  passport.deserializeUser((user: string, cb) => {
    cb(null, user!);
  });


// *** LOGIN END *** 

// *** GET INFORMATION ABOUT CURRENT USER ***


app.get("/user_info",
  (req, res) => {
    const admin = true;

    console.log("the req.user: ", req.user);
    const user_info = {
      email:req.user,
      is_admin: admin
    }

    res.send(user_info);
  }
);

// *** SQL DATABASE START ***


  // GENERAL REQUESTS TO GET INFORMATION
  app.post("/get_table_info",
    async (req, res) => {
      const sort_field = req.body.sort_field ? req.body.sort_field : "*";
      const table_name: string = req.body.table_name;
      const filter_key: string = req.body.filter_key;
      const filter_item: string = req.body.filter_item;
      const order_key: string = req.body.order_key; 

      let search_condition = "";
      if(filter_key){
        search_condition = `WHERE ${filter_key}=${filter_item}`
      };

      let order_condition = "";
      if(order_key){
        order_condition = `ORDER BY ${order_key}`
      };
        try {
          const response = await db.query(
            `SELECT ${sort_field} FROM ${table_name} ${search_condition} ${order_condition};`
          )
        
          const data = response.rows;
          // convert sent dates to proper format
          data.map((item, index:number) => {
            const data_keys = Object.keys(item);
            data_keys.findIndex((key_name:string, key_index:number) => {
              if(key_name.includes("date")){
                const target_value = data[index][data_keys[key_index]];
                if(target_value !== null){
                  const converted_date = target_value.toLocaleDateString();
                  data[index][data_keys[key_index]] = converted_date;
                }
              }
            })
          });  

          res.send(data);

          //console.log("the response: ", response.rows)
        } catch (error) {
          console.log(`Error getting infomation from ${table_name} : `,error);
        }
      }
    
  );

  // GET THE COLUMN NAMES
  app.post("/get_columns",
    async (req, res) => {
      const table_name = req.body.table_name
      try {
        const response = await db.query(
          "SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = $1 AND NOT column_name = 'id';",
          [table_name]
        );
        res.send(response.rows);
      } catch (error) {
        console.log(`Error getting columns for ${table_name} from database: `,error);
      }

    }
  );


  // ADD, EDIT OR DELETE IN THE DATABASE
  app.post("/edit_form_data",
    async (req, res) => {
      interface Types_entry_item{
        [key:string]: string;
      }

      interface Types_table_data{
        search_condition: string;
        name_values:string;
        name_columns:string;
        edit_values:string;
      }

      interface Types_string_data{
        entry_item: Types_entry_item;
        entry_filter_item: string;
        submit_method: string;
      }

      const table_name: string = req.body.table_name;
      const filter_key: string = req.body.filter_key;
      const filter_item: string = req.body.filter_item;
      const sent_submit_method: string = req.body.submit_method;
      const submit_data: Types_entry_item | Types_entry_item[] = req.body.submit_data;
      const column_names: {column_name:string}[]  = req.body.db_column_info;

  

      console.log("the recieved data: ", submit_data,"\n",
                  "the recieved column names: ", column_names,"\n",
                  "the sent_submit_method: ", sent_submit_method
      );

    

      // FUNCTION TO FIND THE DATA TO BE ADDED AND CREATE A STRING FOR THE DB QUERY
      function string_data({entry_item, entry_filter_item, submit_method }:Types_string_data){
        console.log("THE CURRENT ITEM: ", entry_item);
        let search_condition = "";
        let name_values = "";
        let name_columns = "";
        let edit_values = "";

        // SET THE SEARCH CONDITION
        if(filter_key){
          search_condition = `WHERE ${filter_key}=${entry_filter_item}`
        };

        // DEFINE KEY, VALUE PAIRS AS STRINGS
        column_names.map((item:{column_name:string}) => {
          const column = item.column_name;
          const data_value = entry_item[column];

          // PATH IF ADD IS THE METHOD
          if (submit_method === "add"){
            if (data_value !== ""){
              if (name_values === ""){
                name_columns += column;
                name_values += `'${data_value}'`;
              } else {
                name_columns += ', ' + column;
                name_values += `, '${data_value}'`;
              }
            }
          // PATH IF EDIT IS THE METHOD
          } else if (submit_method === "edit"){
            if(edit_values === ""){
              edit_values += `${column} = '${data_value}'`;
            } else {
              edit_values += `, ${column} = '${data_value}'`;
            };
          };
        });
        return {
          search_condition: search_condition,
          name_values: name_values,
          name_columns: name_columns,
          edit_values: edit_values
        }
      };

      async function access_db({table_data, submit_method}:{table_data:Types_table_data, submit_method:string}){
 
        if(submit_method === "add"){
          console.log(
            "the name_columns: ", table_data.name_columns,'\n',
             "the name_values: ", table_data.name_values,'\n',
          );
          try {
            const response = await db.query(
              `INSERT INTO ${table_name}(${table_data.name_columns}) VALUES(${table_data.name_values});`
            )
     
          } catch (error) {
            console.log(`Error adding data to ${table_name}: `,error);
            res.send(`Error adding data in ${table_name}: ${error}`);
          }
        } else if(submit_method === "edit"){
          console.log(
            "the edit_values: ", table_data.edit_values,'\n',
            "the search_condition: ", table_data.search_condition
          );
          try {
            const response = await db.query(
              `UPDATE ${table_name} SET ${table_data.edit_values} ${table_data.search_condition};`,
            );

          } catch (error) {
            console.log(`Error editing data in ${table_name}: `,error);
            res.send(`Error editing data in ${table_name}: ${error}`);
          } 
        }else if (submit_method === "delete"){
            try {
              const response = await db.query(
                `DELETE FROM ${table_name} ${table_data.search_condition};`
              );
            } catch (error) {
              console.log(`Error deleting data in ${table_name}: `,error);
              res.send(`Error deleting data in ${table_name}: ${error}`);
            }
        }
      }

      if(Array.isArray(submit_data)){
        submit_data.map((item:Types_entry_item)=>{
          let adjust_submit_method = sent_submit_method;
          if(sent_submit_method === "add" && item.id){
            adjust_submit_method = "edit"
          }; 
          const table_data:Types_table_data = string_data({entry_item: item, entry_filter_item:item[filter_key], submit_method:adjust_submit_method});
          access_db({table_data:table_data, submit_method: adjust_submit_method});
        });
        res.send(`successfully ${sent_submit_method}ed`);
      } else {
        const table_data:Types_table_data = string_data({entry_item: submit_data, entry_filter_item: filter_item, submit_method:sent_submit_method});
        access_db({table_data:table_data, submit_method:sent_submit_method});
        res.send(`successfully ${sent_submit_method}ed`);
      }

    }
  );




  // ADD EMPOYEES

    // HAS A NEW, EDIT, AND DELETE OPTIONS

    // 1. retrieve information from a form

    // 2. have admin as a yes/no option

    // 3. have section to add user departments from a pool of existing departments
      // make the selection of departments be a yes/no option in the query

  // ADDING DEPARTMENTS

    // HAS A NEW, EDIT, AND DELETE OPTIONS

    // 1. get input for department name

    // 2. add name to departments table & the employee_departments table

    /* 3. add color for department
          ensure colours used on website can't be selected, as well as white and black.
    */

    /* 4. select order position for department
          preferably a drag and drop to change the order of departments on the fly.

          * This will require other entries to updated should the new departments position
            an existing entry position

    */    

  // ADD CLIENTS

    // GET CLIENTS IN DATABASE

    // HAS A NEW, EDIT, AND DELETE OPTIONS

  // ADD PROJECTS

    // HAS A NEW, EDIT, AND DELETE OPTIONS

    // 1. select client from a dropdown
    
    // 2. get info from a form
      // * have info text saying production budget is just for departments.


  
  // DEPARTMENT BUDGETS

    // 1. select a project from the dropdown (filter out complete projects)

    // 2. retrieve production budget from projects table

    /* 3. has fields for each department (based on order) 
          with total budget visible above (which adjusts)
    */

    /* 4. each department field has a column for % of budget, $ amount, and hours for department. 
          all are editable and adjust based on input
          
          also has a dropdown at the end to select employee to add to job
            dropdown filters through employess with that department assigned to them
            gets the employees rate, and affects hours input respectively.
            hours needs to round to whole numbers
          
          has button below each department to add addtional worker
    */

    /* 5. have a section that shows production dates breakdown
          based on shipping date 
          ability to add buffer days between departments  

    */

// *** SQL DATABASE END ***


ViteExpress.listen(app, Number(PORT), () =>
  console.log(`Server is listening on port ${PORT}`),
);
