const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql= require("mysql2");


const db = mysql.createConnection(
	{
		host: "localhost",
		// MySQL username,
		user: "root",
		// MySQL password
		password: "Password123",
		database: "employee_db",
	},
	console.log(`Connected to the employee_db database.`)
);

db.connect(err =>{
    if(err) throw err;
    promptUser();
});

const promptUser = () =>{
    inquirer.prompt([
        {   
            name: home,
            type: list,
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }
    ]
    ).then((response) => {
        switch (response.home){
            case "View All Employees":
                viewEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewDepartmentss();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Quit":
                db.end();
                console.log("The employee tracker app have been quit");
                break;
            default:
            break;
        }
    })
}
// inner join only joins ones in common between two tables
// 
viewEmployees = () =>{
    console.log("Showing all employees: \n");
    const sql = `SELECT employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS department,
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.promise().query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};
viewRoles = () =>{
    console.log("Showing all roles: \n");
    const sql = `SELECT role.id,
    role.title,
    department.name As department FROM role,
    role.salary
    LEFT Join department ON role.department_id = department.id`;
    db.promise().query(sql, (err, rows)=>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewDepartments = () => {
	console.log("Showing all departments: \n");
	const sql = `SELECT * FROM department`;
	db.promise().query(sql, (err, rows) => {
		if (err) throw err;
		console.table(rows);
		promptUser();
	});
};

addEmployee = () =>{
    console.log("Adding employee: \n");
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the new employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the new employee's last name?"
        }
    ]).then(answers=>{
        const params =[answers.firstName, answers.lastName];
        const roleSql = `SELECT role.id, role.title FROM role`;
        db.promise().query(roleSql, (err, res) =>{
            if(err) throw err;
            const roles = res.map(({id, title})=>({name:title, value:id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "What is the new employee's role?",
                    choices: roles
                }
            ]).then(chosenRole =>{
                const empRole = chosenRole.role;
                params.push(empRole);
                const manSql = `SELECT * FROM employee`;
                db.promise().query(manSql, (err, result)=>{
                    if(err) throw err;
                    const managers = result.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the new employee's manager?",
                            choices: managers
                        }
                    ]).then(chosenMan =>{
                        const empMan = chosenMan.manager;
                        params.push(empMan);
                        const sql = `INSERT INTO employee (first_name, Last_name, role_id, manager_id)
                        VALUES (?,?,?,?)`;
                        db.promise().query(sql, params, (err,res)=> {
                            if(err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to employee list`);
                            viewEmployees();
                        });
                        
                    });
                });
            });
        });
    });
};

addRole= () =>{
    console.log("Adding a new role \n");
		inquirer
			.prompt([
            {
				type: "input",
				name: "newRole",
				message: "What is the name of the new role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the new role?"
            }
            ])
			.then((answers) => {
                const params = [answers.newRole, answers.salary];
				const deptSql = `SELECT department.name, department.id FROM department`;
				db.promise().query(deptSql, (err, res) => {
					if (err) throw err;
                    // res.map(res =>res.department_name)
                    const dept = res.map(({name,id}) => ({name: name, value: id}));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "dept",
                            message: "What department does this role fall under?",
                            choices: dept
                        }
                    ]).then(answer =>{
                        const chosenDept = answer.debt;
                        params.push(chosenDept);
                        const sql = `INSET INTO role (title, salary, department_id)
                        VALUE(?,?,?)`;
                        db.promise().query(sql, params, (err, results) =>{
                            if(err) throw err;
                            console.log(`Added ${answers.newRole} to the roles`);
                            viewRoles();
                        });
                    });
				});
			});
};

addDepartment = () =>{
    console.log("Adding a new department \n");
    inquirer.prompt({
        type: "input",
        name: "newDept",
        message: "What is the name of the new department?"
    }).then(answer=> {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.promise().query(sql, answer.newDept,(err,res)=>{
            if(err) throw err;
            console.log(`Added ${answer.newDept} to departments`);
            viewDepartments();
        });
    });
};

updateRole = () =>{
    console.log(`Updating an employee's role \n`);
    const empSql = `SELECT * FROM employee`;
    db.promise().query(empSql, (err,res) =>{
        if(err) throw err;
        const employees = res.map(({id,first_name, last_name}) =>({name: first_name + " "+ last_name, value: id}));
        inquirer.prompt([
        {
            type: "list",
            name: "empName",
            message: "Which employee's role would you like to be updated?",
            choices: employees
        }
        ]).then(answer =>{
            const chosenEmp = answer.empName;
            const params =[];
            params.push(chosenEmp);
            const roleSql = `SELECT * FROM role`;
            db.promise().query(roleSql, (err, results)=>{
                if(err) throw err;
                const roles = resutls.map(({id, title})=>({name:title, value: id}));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Which is the employee's new role?",
                        choices: roles
                    }
                ]).then(roleChoice =>{
                    const newRole = roleChoice.role;
                    params.push(newRole);
                    const sql = `UPDATE employee SET role_id = ? WHERE id =?`;
                    db.promise().query(sql, [newRole.id, chosenEmp.id],(err,res)=>{
                        if(err) throw err;
                        console.log(`Updated the role of ${chosenEmp} to ${newRole}`);
                        viewEmployees();
                    });
                });
            });
        });
    });
};
