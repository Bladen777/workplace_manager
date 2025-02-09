CREATE TABLE employees(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
email varchar(255) UNIQUE NOT NULL ,
name varchar(255),
admin bit(1) NOT NULL,
role varchar(50),
title varchar(255),
pay_rate decimal(20,2),
pay_type varchar(50),
employment_type varchar(50),
employment_status varchar(50),
hours_per_week int,
employment_start_date date,
employment_end_date date
);

CREATE TABLE employee_departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id)
-- DEPARTMENT COLUMNS WILL BE ADDED ON THE FRONT END
-- THEIR VALUES WILL BE 0 OR 1 FOR FALSE AND TRUE
);

CREATE TABLE departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
department_name varchar(255) UNIQUE NOT NULL,
department_order int NOT NULL,
department_color varchar(255) UNIQUE NOT NULL
);

CREATE TABLE clients(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
name varchar(255) UNIQUE NOT NULL,
address varchar(255),
date_added date
);

CREATE TABLE projects(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
client_name varchar(255) REFERENCES clients(name), 
production_budget decimal(15,2),
project_address varchar(255),
shipping_address varchar(255),
date_added date,
ship_date date
);

CREATE TABLE employee_budgets(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id),
project_id int REFERENCES projects(id),
department_name int REFERENCES departments(id),
start_date date,
budget_hours int
);
