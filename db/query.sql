SELECT role.id, role.title, department.name AS department, role.salary 
FROM role 
JOIN department ON department.id = role.department_id;

SELECT sup.id, sup.first_name, sup.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(sub.first_name, ' ', sub.last_name) AS manager
FROM employee sup
LEFT JOIN role ON role.id = sup.role_id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee sub ON sub.id = sup.manager_id;