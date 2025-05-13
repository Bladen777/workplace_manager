CREATE TABLE employees(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
email varchar(255) UNIQUE NOT NULL ,
name varchar(255) NOT NULL,
admin bit(1) NOT NULL,
role varchar(50),
title varchar(255),
pay_rate decimal(20,2),
pay_type varchar(50),
employment_type varchar(50),
part_time bit(1),
hours_per_week int,
employment_start_date date,
employment_end_date date,
);

CREATE TABLE clients(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
name varchar(255) UNIQUE NOT NULL,
address varchar(255),
date_added date
);

CREATE TABLE client_jobs(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
name varchar(255) NOT NULL,
client_id int REFERENCES clients(id) NOT NULL, 
date_added date
);

CREATE TABLE departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
department_name varchar(255) UNIQUE NOT NULL,
department_order int NOT NULL,
department_color varchar(255) UNIQUE NOT NULL
);

CREATE TABLE employee_departments(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id) NOT NULL
);

CREATE TABLE projects(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
project_name varchar(255) NOT NULL,
client_id int REFERENCES clients(id) NOT NULL,
job_id int REFERENCES client_jobs(id) NOT NULL, 
production_budget decimal(15,2),
project_address varchar(255),
shipping_address varchar(255),
date_added date,
ship_date date,
start_date date,
finish_date date,
details text
);

CREATE TABLE project_department_budgets(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
project_id int REFERENCES projects(id) NOT NULL,
department_id int REFERENCES departments(id) NOT NULL,
start_date date,
finish_date date,
budget decimal(15,2)
);

CREATE TABLE employee_budgets(
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
employee_id int REFERENCES employees(id) NOT NULL,
project_id int REFERENCES projects(id) NOT NULL,
department_id int REFERENCES departments(id) NOT NULL,
start_date date,
budget decimal(15,2),
budget_hours decimal(15,2)
);
