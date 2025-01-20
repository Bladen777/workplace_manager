import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import env from "dotenv";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import bodyParser from "body-parser";

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
  let db;
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

    const admin = 1;

    console.log("the req.user: ", req.user);
    const user_info = {
      email:req.user,
      is_admin: admin
    }

    res.send(user_info);
  }
);


// *** SQL DATABASE START ***


  // GENERAL HTTP REQUESTS, FOR CLIENTS, EMPOYEES, AND DEPARTMENTS
  app.post("/get_table_info",
    async (req, res) => {
      const sort_field = req.body.sort_field ? req.body.sort_field : "*";
      const table_name = req.body.table_name;
      const filter_name = req.body.filter_name;
      const filter_item = req.body.filter_item;
      const order_item = req.body.order_item; 

      let search_condition = "";
      if(filter_name){
        search_condition = `WHERE ${filter_name}=${filter_item}`
      };

      let order_condition = "";
      if(order_item){
        order_condition = `ORDER BY ${order_item}`
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



  app.post("/edit_form_data",
    async (req, res) => {
      const table_name = req.body.table_name;
      const filter_name = req.body.filter_name;
      const filter_item = req.body.filter_item;
      const submit_method = req.body.submit_method;
      const submit_data = req.body.submit_data;
      const column_names = req.body.db_column_info;

      console.log("the recieved data: ", submit_data, "\n",
                  "the recieved column names: ", column_names, "\n",
                  "the submit_method: ", submit_method
      );

      let search_condition;
      if(filter_name){
        search_condition = `WHERE ${filter_name}=${filter_item}`
      };
      let name_values = "";
      let name_columns = "";
      let edit_values = "";

      // function to find the data to be added and create a string for the db query
      function string_data(){
        column_names.map((item:{column_name:string}) => {
          const column = item.column_name
          const data_value = submit_data[column];
          // path if add is the method
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
          // path if edit is the method
          } else if (submit_method === "edit"){
            if(edit_values === ""){
              edit_values += `${column} = '${data_value}'`;
            } else {
              edit_values += `, ${column} = '${data_value}'`;
            }
          }
        })
      };

      console.log("the name_columns: ", name_columns);
      console.log("the name_values: ", name_values);
      console.log("the edit_values: ", edit_values);

      string_data();
      if(submit_method === "add"){
        try {
          const response = await db.query(
            `INSERT INTO ${table_name}(${name_columns}) VALUES(${name_values});`
          )
          res.send(`successfully ${submit_method}ed`);
        } catch (error) {
          console.log(`Error adding data to ${table_name}: `,error);
        }
      } else if(submit_method === "edit"){
        try {
          const response = await db.query(
            `UPDATE ${table_name} SET ${edit_values} ${search_condition};`,
          );
        } catch (error) {
          console.log(`Error editing data in ${table_name}: `,error);
        } 
      }else if (submit_method === "delete"){
          try {
            const response = await db.query(
              `DELETE FROM ${table_name} ${search_condition};`
            );
          } catch (error) {
            console.log(`Error deleting data in ${table_name}: `,error);
          }
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

    app.get("/get_clients",
      async (req, res) => {
        try {
          let get_clients = await db.query(
            "SELECT id, name AS client_name, address AS client_address, TO_CHAR(date_added, 'YYYY/MM/DD') AS client_date FROM clients ORDER BY id;"
          )
          res.send(get_clients.rows);
        } catch (error) {
          console.log('Error getting clients from database: ',error);
        }
      }
    )

    app.post("/get_specific_client",
      async (req, res) => {
    
        try {
          let get_specific_client = await db.query(
            "SELECT id, name AS client_name, address AS client_address, TO_CHAR(date_added, 'YYYY-MM-DD') AS client_date FROM clients WHERE id=$1;",
            [req.body.client_id]
          );
          res.send(get_specific_client.rows);
        } catch (error) {
          console.log('Error getting specific client from database: ',error);
        }
      }
    )

    // HAS A NEW, EDIT, AND DELETE OPTIONS

    app.post("/client_edit", 
      async (req, res) => {
        console.log("request.body",req.body);
        const item_id = req.body.id;
        const method = req.body.method;
        const client_name = req.body.name;
        const client_address = req.body.address;
        const client_date = req.body.date;

        if(method === "add"){
          try {
            let new_client_data = await db.query(
              "INSERT INTO clients(name, address, date_added) VALUES ($1, $2, $3);",
              [client_name, client_address, client_date]
            );
          } catch (error) {
            console.log('Error adding clients to database: ',error);
          }
        } else if( method === "edit"){
          try {
            let edit_client_data = await db.query(
              "UPDATE clients SET name = $1, address = $2, date_added = $3 WHERE id=$4;",
              [client_name, client_address, client_date, item_id]
            );
          } catch (error) {
            console.log('Error editing clients in the database: ',error);
          }
        }

        res.send(`${client_name} successfully ${method}ed`);
        
      });

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
