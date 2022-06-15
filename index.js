const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Tkk0316Good',
        database: 'employee_db'
    },
    console.log("Connected to the employee_db database.")
);

inquirer
  .prompt([
    {
      type: "list",
      name: "motivation",
      message: "What would you like to do?",
      choices: [
                "Add Employee", 
                "Update Employee Role", 
                "View All Roles", 
                "Add Role", 
                "View All Departments", 
                "Add Department",
                "quit"
                ],
    }
  ])
  .then(val => {
    console.log(`You chose ${val.motivation}.`);
    switch (val.motivation) {
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "View All Roles":
            ViewAllRoles();
            break;
        case "Add Role":
            addRole();
            break;
        case "View All Departments":
            viewAllDepartments();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "quit":
            db.end();
            break;
    }
  })



// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });