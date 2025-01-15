import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import env from "dotenv";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import bodyParser from "body-parser";
import pg from "pg"

// LOCAL IMPORTS
import db from "./local_db.js"


const app = express();
env.config();
const PORT:string = process.env.LOCAL_PORT!;
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

db.connect();



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
      console.log("BLAH")
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

    /* TESTING PASSPORT VALUES
    const test_user = passport.session();
    console.log("the test user?: ", test_user);

    console.log("session info: ", req.session.id)

    console.log("cookie data: ", req.cookies);
    */

    console.log("the req.user: ", req.user);

    res.send(req.user);
  }
);

app.get("/is_admin",
  (req, res) => {
    
    res.send("1");
  }
);




// *** SQL DATABASE START ***

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

    // HAS A NEW, EDIT, AND DELETE OPTIONS

    app.post("/client_edit", 
      async (req, res)=>{
        console.log("request.body",req.body);
        const client_name = req.body.name;
        const client_address = req.body.address;
        const client_date = req.body.date;

  
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
