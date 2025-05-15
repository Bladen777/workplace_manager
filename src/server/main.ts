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
import { filter } from "framer-motion/client";


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

    let user_info = {
      email:req.user,
    }

    // *** DELETE THIS LATER ***
    if(user_info.email === undefined){
      user_info = {
        email:"test_user"
      }
    }

    console.log("the user_info: ", user_info);
    res.send(user_info);
  }
);

// *** SQL DATABASE START ***


  // GENERAL REQUESTS TO GET INFORMATION
  app.post("/get_table_info",
    async (req, res) => {
      
      const sort_field = req.body.sort_field ? `"${req.body.sort_field}"` : "*";
      const table_name: string = req.body.table_name;
      const filter_key: string = req.body.filter_key;
      const filter_item: string = req.body.filter_item;
      const filter_key_2: string = req.body.filter_key_2;
      const filter_item_2: string = req.body.filter_item_2;
      let order_key: string = req.body.order_key;
      const order_direction:string = req.body.order_direction; 
      console.log("\n","get_table_info requested for: ", table_name)

      let search_condition = "";
      if(filter_key && filter_key !== ""){
        if(filter_key_2 && filter_key_2 !== ""){
          search_condition = `WHERE ${filter_key}='${filter_item}' AND ${filter_key_2}='${filter_item_2}'`
        } else {
          search_condition = `WHERE ${filter_key}='${filter_item}'`
        };
      };

          // FIND COLUMN NAME BASED ON ORDER KEY PROVIDED
      let order_condition = "ORDER BY id";

      if(!order_key){
        switch (table_name) {
            case "departments":
                order_key = "order";
                break;
            default:
                break; 
        }
      } 

      if(order_key){
        try {
          const db_columns = await db.query(
            "SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = $1;",
            [table_name]
          );

          db_columns.rows.find((key_name)=>{
            if(key_name.column_name.includes(order_key)){
              order_condition = `ORDER BY ${key_name.column_name} ${order_direction === "desc" ? "DESC" : ""}`;
            } 
          })
        
        } catch (error) {
          console.log(`Error getting column names from ${table_name} : `,error);
        }
      }
        try {
          console.log(`SELECT ${sort_field} FROM ${table_name} ${search_condition} ${order_condition};`)
          const response = await db.query(
            `SELECT ${sort_field} FROM ${table_name} ${search_condition} ${order_condition};`
          )
        
          const data = response.rows;
          // CONVERT SENT DATES TO PROPER FORMAT
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
        } catch (error) {
          console.log(`Error getting infomation from ${table_name} : `,error);
        }
      } 
  );


  // GET THE COLUMN NAMES
  app.post("/get_columns",
    async (req, res) => {
      
      const table_name = req.body.table_name
      console.log("\n","get_columns requested for: ", table_name)
      try {
        const response = await db.query(
          "SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = $1 AND NOT column_name = 'id' ORDER BY ordinal_position;",
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
        [key:string]: string | number;
      }

      interface Types_table_data{
        search_condition: string;
        name_values:string;
        name_columns:string;
        edit_values:string;
      }

      interface Types_string_data{
        entry_data: Types_entry_item;
        entry_id?: number;
        submit_method: string;
      }

      const table_name: string = req.body.table_name;
      const filter_key: string = req.body.filter_key;
      const filter_item: string = req.body.filter_item;
      const filter_key_2: string = req.body.filter_key_2;
      const filter_item_2: string = req.body.filter_item_2;
      const sent_submit_method: string = req.body.submit_method;
      const submit_data: Types_entry_item | Types_entry_item[] = req.body.submit_data;
      const column_names: string[]  = req.body.db_column_info;

  
      console.log("\n","edit_form_data requested for: ", table_name )
      console.log("the recieved data: ", submit_data,"\n",
                  "the recieved column names: ", column_names,"\n",
                  "the sent_submit_method: ", sent_submit_method
      );

    

      // FUNCTION TO FIND THE DATA TO BE ADDED AND CREATE A STRING FOR THE DB QUERY
      function string_data({entry_data, entry_id, submit_method }:Types_string_data){
        console.log("THE CURRENT ENTRY: ", entry_data);
        console.log("THE COLUMN NAMES: ", column_names)
        let search_condition = "";
        let name_values = "";
        let name_columns = "";
        let edit_values = "";

        // SET THE SEARCH CONDITION
        if(filter_key && filter_key !== ""){
          if(filter_key_2 && filter_key_2 !== ""){
            search_condition = `WHERE ${filter_key}='${filter_item}' AND ${filter_key_2}='${filter_item_2}'`
          } else {
            search_condition = `WHERE ${filter_key}='${filter_item}'`
          };
        } else if(entry_id) {
          search_condition = `WHERE id ='${entry_id}'`
        };
        

        // DEFINE KEY, VALUE PAIRS AS STRINGS
        column_names.map((column:string) => {

          const data_value = (()=>{
            let item_data: string | number | null = entry_data[column];
            if(item_data === null || item_data === undefined){
              item_data = null;
            } else {
              item_data = `'${item_data}'`;
            };
            return item_data
          })()

          // PATH IF ADD IS THE METHOD
          if (submit_method === "add"){
            if (data_value !== "" && column !== 'id'){
              if (name_values === ""){
                name_columns += `"${column}"`;
                name_values += `${data_value}`;
              } else {
                name_columns += ', ' + `"${column}"`;
                name_values += `, ${data_value}`;
              }
            }
          // PATH IF EDIT IS THE METHOD
          } else if (submit_method === "edit"){
            if(column !== 'id'){
              if(edit_values === ""){
                edit_values += `"${column}" = ${data_value}`;
              } else {
                edit_values += `, "${column}" = ${data_value}`;
              };

            }
          };
        });
        return {
          search_condition: search_condition,
          name_values: name_values,
          name_columns: name_columns,
          edit_values: edit_values
        }
      };
      

      // FUNCTION FOR MANIPULATING DATA
      async function access_db({table_data, submit_method, array_edit}:{table_data:Types_table_data, submit_method:string, array_edit:boolean}){

        if(submit_method === "add"){
          console.log(
            "the name_columns: ", table_data.name_columns,'\n',
            "the name_values: ", table_data.name_values,'\n',
          );
          console.log(`INSERT INTO ${table_name}(${table_data.name_columns}) VALUES(${table_data.name_values});`)
          try {
            const response = await db.query(
              `INSERT INTO ${table_name}(${table_data.name_columns}) VALUES(${table_data.name_values}) RETURNING id;`
            )
            if(!array_edit){
              res.send({
                entry_id: response.rows[0].id,
                message: `successfully ${sent_submit_method}ed`
              });
              console.log(`successfully ${sent_submit_method}ed to ${table_name}`)
            } else {
              return response.rows[0].id;
            }
          } catch (error) {
            console.log(`Error adding data to ${table_name}: `,error);
            res.send({message:`Error adding data in ${table_name}: ${error}`});
          }
        } else if(submit_method === "edit"){
          console.log(
            "the edit_values: ", table_data.edit_values,'\n',
            "the search_condition: ", table_data.search_condition
          );
          console.log(`UPDATE ${table_name} SET ${table_data.edit_values} ${table_data.search_condition};`)
          try {
            const response = await db.query(
              `UPDATE ${table_name} SET ${table_data.edit_values} ${table_data.search_condition} RETURNING id;`,
            );
            if(!array_edit){
              res.send({
                message: `successfully ${sent_submit_method}ed`
              });
              console.log(`successfully ${sent_submit_method}ed to ${table_name}`)
            } else {
              return response.rows[0].id;
            }
          } catch (error) {
            console.log(`Error editing data in ${table_name}: `,error);
            res.send({message:`Error editing data in ${table_name}: ${error}`});
          } 
        }
      }

      // DETERMINE WHAT KIND OF DATA MANIPULATION TO DO
      if(sent_submit_method === "delete"){
     
        const search_condition = `WHERE ${filter_key}=${filter_item}`
        const search_condition_2 = ""
        console.log(`DELETE FROM ${table_name} ${search_condition};`)
        try {
          const response = await db.query(
            `DELETE FROM ${table_name} ${search_condition};`
          );
          res.send({
            message: `successfully ${sent_submit_method}d`
          });
          console.log(`successfully ${sent_submit_method}d to ${table_name}`)
          
        } catch (error) {
          console.log(`Error deleting data in ${table_name}: `,error);
          res.send({message:`Error deleting data in ${table_name}: ${error}`});
        }

      } else if(Array.isArray(submit_data)){
        let added_id:number = 0;
        for await(let entry of submit_data){
          let adjust_submit_method = sent_submit_method;
          console.log(`entry.id === ${entry.id}, type === ${typeof(entry.id)}`)
          if(entry.id === -1){
            adjust_submit_method = "add";
          }else if(sent_submit_method === "add" && entry.id){
            adjust_submit_method = "edit";
          };
          const table_data:Types_table_data = string_data({
            entry_data: entry, 
            entry_id: Number(entry.id), 
            submit_method:adjust_submit_method
          });
          added_id = await access_db({table_data:table_data, submit_method: adjust_submit_method, array_edit: true});

        };
        res.send({
          entry_id: added_id !== 0 ? added_id : "",
          message: `successfully ${sent_submit_method}ed`
        });
        console.log(`successfully ${sent_submit_method}ed to ${table_name}`, `entry_id:${added_id}`)

      } else {
        const table_data:Types_table_data = string_data({entry_data: submit_data, submit_method:sent_submit_method});
        access_db({table_data:table_data, submit_method:sent_submit_method, array_edit:false});
      }

    }
  );

  // ADJUST DEPARTMENT NAME COLUMNS IN THE EMPLOYEE_DEPARTMENTS TABLE
  app.post("/edit_dep_cols",
    async (req, res) => {
      console.log("edit_dep_cols requested", "\n");

      const dep_name = `dep_id_${req.body.dep_id}`;
      const submit_method = req.body.submit_method;

      if(submit_method === "add"){
        try{
          const employee_deps_response = await db.query(
            `ALTER TABLE employee_departments ADD COLUMN "${dep_name}" bit(1)`,
            []
          )
        } catch (error){
          console.log(`%c  Error when adding columns to employee deps: `, 'background-color:darkred', error); 
        };
      } else if (submit_method === "delete"){
        try{
          const employee_deps_response = await db.query(
            `ALTER TABLE employee_departments DROP COLUMN "${dep_name}"`,
            []
          )
        } catch (error){
          console.log(`%c  Error when removing columns from employee deps: `, 'background-color:darkred', error); 
        };
      }
      res.send("edit_deps_cols finished")
      console.log("edit_deps_cols finished")
    }
  );      

// *** SQL DATABASE END ***


ViteExpress.listen(app, Number(PORT), () =>
  console.log(`Server is listening on port ${PORT}`),
);
