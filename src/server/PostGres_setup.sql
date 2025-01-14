CREATE TABLE employees(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
email UNIQUE NOT NULL varchar(255),
name varchar(255),
admin bit(1) NOT NULL,
title varchar(255),
rate decimal(4,2),
employ_date date,
)

CREATE TABLE employee_departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id),
-- DEPARTMENT COLUMNS WILL BE ADDED ON THE FRONT END
-- THEIR VALUES WILL BE 0 OR 1 FOR FALSE AND TRUE
)

CREATE TABLE employee_budgets(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id),
project_id int REFERENCES projects(id),
department_name int REFERENCES departments(id),
start_date date,
budget_hours int,
)

CREATE TABLE departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
department_name varchar(255) UNIQUE NOT NULL,
department_order int NOT NULL,
department_color varchar(255) UNIQUE NOT NULL, 
)

CREATE TABLE clients(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
name varchar(255) UNIQUE NOT NULL,
address varchar(255),
date_added date,
)

CREATE TABLE projects(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
client_id int REFERENCES clients(id) 
production_budget decimal(15,2),
project_address varchar(255),
shipping_address varchar(255),
date_added date,
ship_date date,
)

