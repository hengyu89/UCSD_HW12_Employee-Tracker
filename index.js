const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Menu = require('../UCSD_HW10_Team-Profile-Generator/src/Menu');

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

const MenuChoose = () => {
    inquirer
  .prompt([
    {
      type: "list",
      name: "motivation",
      message: "What would you like to do?",
      choices: [
          "View All Employee",
          "Add Employee", 
          "Update Employee Role", 
          "View All Roles", 
          "Add Role", 
          "View All Departments", 
          "Add Department",
          "Quit"
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
            viewAllRoles();
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
        case "View All Employee":
            viewAllEmployee();
            break;
        case "Quit":
            db.end();
            break;
    }
  });
};

const viewAllDepartments = () => {
    const sql = "SELECT id, name FROM department";
    db.query(sql, (err, results) => {
        if(err) {
            res.status(500).json({ error: err.message});
            return;
        }
        displayTable(results);
    })
    MenuChoose();
};

const viewAllRoles = () => {
    const sql = `SELECT role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
                FROM role JOIN department 
                ON department.id = role.department_id;`
    db.query(sql, (err, results) => {
        if(err) {
            res.status(500).json({ error: err.message});
            return;
        }
        displayTable(results);
    })
    MenuChoose();
};

const viewAllEmployee = () => {
    const sql = `SELECT sup.id, sup.first_name, sup.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(sub.first_name, ' ', sub.last_name) AS manager
    FROM employee sup
    LEFT JOIN role ON role.id = sup.id
    LEFT JOIN department ON department.id = role.department_id
    LEFT JOIN employee sub ON sub.id = sup.manager_id;`
    db.query(sql, (err,results) => {
        if(err) {
            res.status(500).json({ error: err.message});
            return;
        }
        displayTable(results);
    })
    MenuChoose();
}

const displayTable = (table) => {
    console.log("\n");
    console.table(table);
    console.log("\n");
};


MenuChoose();

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });