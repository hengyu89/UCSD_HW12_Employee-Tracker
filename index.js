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

var updatedRole = [];
var updatedManager = [];

const updateList = () => {
    updatedRole = [];
    updatedManager = [];
    db.query("SELECT title FROM role", (err, results) => {
        for (let i = 0; i < results.length; i++) {
            updatedRole.push(results[i].title);
        }
    });
    db.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, results) => {
        for (let i = 0; i < results.length; i++) {
            updatedManager.push(results[i].name);
        }
    });
    return updatedRole, updatedManager;
}




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

const addDepartment = () => {
    inquirer
    .prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "What is the name of the department?",
        }
    ])
    .then(val => {
        const sql = `INSERT INTO department (name)
        VALUES ("${val.newDepartment}");`;
        db.query(sql, (err, results) => console.log("Added",val.newDepartment,"to the database"));
        MenuChoose();
    });
}

const addRole = () => {
    var updatedDepart = [];
    db.query("SELECT name FROM department", (err, results) => {
        for (let i = 0; i < results.length; i++) {
            updatedDepart.push(results[i].name);
        }
    });
    
    inquirer
    .prompt([
        {
            type: "input",
            name: "nameOfRole",
            message: "What is the name of the role?",
        },
        {
            type: "number",
            name: "salaryOfRole",
            message: "What is the salary of the role?",
        },
        {
            type: "list",
            name: "departmentOfRole",
            message: "Which department does the role belong to?",
            choices: updatedDepart,
        }
    ])
    .then(val => {
        const sql = `INSERT INTO role (title, salary, department_id)
        VALUES ("${val.nameOfRole}", ${val.salaryOfRole}, ${updatedDepart.indexOf(val.departmentOfRole)+1});`;
        db.query(sql, (err, results) => console.log("Added",val.nameOfRole,"to the database"));
        updateList();
        MenuChoose();
    })
}

const addEmployee = () => {
    updateList();
    var ManagerListWithNone = updatedManager;
    ManagerListWithNone.unshift("None");
    // console.log(ManagerListWithNone);

    inquirer
    .prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "employeeOfRole",
            message: "What is the employee's role?",
            choices: updatedRole,
        },
        {
            type: "list",
            name: "employeeOfManager",
            message: "Who is the employee's manager?",
            choices: updatedManager,
        }
    ])
    .then(val => {
        var managerID = updatedManager.indexOf(val.employeeOfManager);
        if(managerID == 0) {
            managerID = null;
        }
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${val.first_name}", "${val.last_name}", ${updatedRole.indexOf(val.employeeOfRole)+1}, ${managerID});`;
        console.log(`Test:\nfirst name:${val.first_name}\nlast name:${val.last_name}\nrole_id: ${updatedRole.indexOf(val.employeeOfRole)+1}\nmanager_id: ${managerID}`);
        console.log(`\n${updatedRole}\n \n${val.employeeOfRole}\n \n${updatedRole.indexOf(val.employeeOfRole)+1}`)
        db.query(sql, (err, results) => console.log("Added",val.first_name,val.last_name,"to the database"));
        updateList();
        MenuChoose();
    })
};

const updateEmployeeRole = () => {
    inquirer
    .prompt([
        {
            type: "list",
            name: "wantEmployee",
            message: "Which employee's role do you want to update?",
            choices: updatedManager,
        },
        {
            type: "list",
            name: "wantRole",
            message: "Which role do you want to assign the selected employee?",
            choices: updatedRole,
        }
    ])
    .then(val => {
        const newRoleID = updatedRole.indexOf(val.wantRole) + 1;
        const employeeID = updatedManager.indexOf(val.wantEmployee) + 1;
        const sql = `UPDATE employee
                    SET role_id = ${newRoleID} WHERE id = ${employeeID}`;
        db.query(sql, (err, results) => console.log("Updated employee's role"));
        updateList();
        MenuChoose();
    })
};

const viewAllDepartments = () => {
    const sql = "SELECT id, name FROM department";
    db.query(sql, (err, results) => displayTable(results))
    MenuChoose();
};

const viewAllRoles = () => {
    const sql = `SELECT role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
                FROM role JOIN department 
                ON department.id = role.department_id;`
    db.query(sql, (err, results) => displayTable(results))
    MenuChoose();
};

const viewAllEmployee = () => {
    const sql = `SELECT sup.id, sup.first_name, sup.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(sub.first_name, ' ', sub.last_name) AS manager
    FROM employee sup
    LEFT JOIN role ON role.id = sup.role_id
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

updateList();
MenuChoose();

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });