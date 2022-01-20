const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql= require("mysql2");

//connects to sql database
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
//main prompt of actions
const promptUser = () =>{
    inquirer.prompt([
        {   
            type: "list",
            name: "home",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Update Employee Manager",
                "View Employees By Manager",
                "View Employees By Department",
                "Delete Department",
                "Delete Role",
                "Delete Employee",
                "View Department Budgets",
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
                viewDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Update Employee Manager":
                updateManager();
                break;
            case "View Employees By Manager":
                viewByMan();
                break;
            case "View Employees By Department":
                viewByDept();
                break;
            case "Delete Department":
                deleteDep();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmp();
                break;
            case "View Department Budgets":
                viewBudget();
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
// function to display all eployees stored
viewEmployees = () =>{
    console.log("Showing all employees: \n");
    const sql = `SELECT employee.id,
    employee.first_name,
    employee.last_name,
    roles.title,
    department.name AS department,
    roles.salary,
    CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};
// function to display all roles stored
viewRoles = () =>{
    console.log("Showing all roles: \n");
    const sql = `SELECT roles.id,
    roles.title,
    department.name As department,
    roles.salary FROM roles
    LEFT JOIN department ON roles.department_id = department.id`;
    db.query(sql, (err, rows)=>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};
// function to display all departments stored
viewDepartments = () => {
	console.log("Showing all departments: \n");
	const sql = `SELECT * FROM department`;
	db.query(sql, (err, rows) => {
		if (err) throw err;
		console.table(rows);
		promptUser();
	});
};
// function to create a new employee and add it to database
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
        const roleSql = `SELECT roles.id, roles.title FROM roles`;
        db.query(roleSql, (err, res) =>{
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
                db.query(manSql, (err, result)=>{
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
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?,?,?,?)`;
                        db.query(sql, params, (err,res)=> {
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
// function to create a new role and add it to database
addRole= () =>{
    console.log("Adding a new role: \n");
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
				db.query(deptSql, (err, res) => {
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
                        const chosenDept = answer.dept;
                        params.push(chosenDept);
                        const sql = `INSERT INTO roles (title, salary, department_id)
                        VALUE(?,?,?)`;
                        db.query(sql, params, (err, results) =>{
                            if(err) throw err;
                            console.log(`Added ${answers.newRole} to the roles`);
                            viewRoles();
                        });
                    });
				});
			});
};
// function to create a new department and add it to database
addDepartment = () =>{
    console.log("Adding a new department: \n");
    inquirer.prompt({
        type: "input",
        name: "newDept",
        message: "What is the name of the new department?"
    }).then(answer=> {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.newDept,(err,res)=>{
            if(err) throw err;
            console.log(`Added ${answer.newDept} to departments`);
            viewDepartments();
        });
    });
};
// function to change an employee's role 
updateRole = () =>{
    console.log(`Updating an employee's role: \n`);
    const empSql = `SELECT * FROM employee`;
    db.query(empSql, (err,res) =>{
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
            // const params =[];
            // params.push(chosenEmp);
            const roleSql = `SELECT * FROM roles`;
            db.query(roleSql, (err, results)=>{
                if(err) throw err;
                const roles = results.map(({id, title})=>({name:title, value: id}));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Which is the employee's new role?",
                        choices: roles
                    }
                ]).then(roleChoice =>{
                    const newRole = roleChoice.role;
                    // params.push(newRole);
                    const sql = `UPDATE employee SET role_id = ? WHERE id =?`;
                    db.query(sql, [newRole, chosenEmp],(err,res)=>{
                        if(err) throw err;
                        console.log(`Updated the role of ${chosenEmp} to ${newRole}`);
                        viewEmployees();
                    });
                });
            });
        });
    });
};
// function to change an employee's manager

updateManager = () =>{
    console.log("Updating an employee's manager: \n");
    const manSql = `SELECT * FROM employee`;
    db.query(manSql, (err,res)=>{
        if(err) throw err;
        const employees = res.map(({id, first_name, last_name})=>({name: first_name + " " + last_name, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee's manager should be updated?",
                choices: employees
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's new manager?",
                choices: employees
            }
        ]).then(answers=>{
            const chosenEmp = answers.employee;
            const manager = answers.manager;
            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
            db.query(sql,[manager, chosenEmp],(err,result)=>{
                if(err) throw err;
                console.log(`Updated the manager of ${chosenEmp} to ${manager}`);
                viewEmployees();
            });
        });
    });
};
// function to view all employees by their manager
viewByMan = () =>{
    console.log("Showing all employees by manager: \n");
    const sql = `SELECT employee.first_name,
    employee.last_name,
    CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY manager.id`;
    db.query(sql, (err, rows) => {
		if (err) throw err;
		console.table(rows);
		promptUser();
	});
};
// function to view all employees by their department
viewByDept = () =>{
    console.log("Showing all employees by department: \n");
    const sql = `SELECT employee.first_name,
    employee.last_name,
    department.name AS department FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id ORDER BY department.id`;
    db.query(sql, (err,res)=>{
        if(err) throw err;
        console.table(res);
        promptUser();
    });
};
// function to delete a department
deleteDep = () =>{
    console.log("Deleting a department: \n");
    const depSql = `SELECT * FROM department`;
    db.query(depSql, (err, res)=>{
        if(err) throw err;
        const dep = res.map(({id,name})=>({name: name, value: id}));;
        inquirer.prompt([
            {
                type: "list",
                name: "delDep",
                message: "Which department would you like to delete?",
                choices: dep
            }
        ]).then(answer =>{
            const choiceDep = answer.delDep;
            const sql = `DELETE FROM department where id = ?`;
            db.query(sql,choiceDep, (err,res)=>{
                if(err) throw err;
                console.log("Deleted ${choiceDep} from department list");
                viewDepartments();
            });
        });
    });
};
// function to delete a role
deleteRole = () => {
	console.log("Deleting a role: \n");
	const rolesSql = `SELECT * FROM roles`;
	db.query(rolesSql, (err, res) => {
		if (err) throw err;
		const role = res.map(({ id, title }) => ({ name: title, value: id }));
		inquirer
			.prompt([
				{
					type: "list",
					name: "delRole",
					message: "Which role would you like to delete?",
					choices: role,
				},
			])
			.then((answer) => {
				const choiceRole = answer.delRole;
				const sql = `DELETE FROM roles where id = ?`;
				db.query(sql, choiceRole, (err, res) => {
					if (err) throw err;
					console.log("Deleted ${choiceRole} from role list");
					viewRoles();
				});
			});
	});
};
// function to delete a employee
deleteEmp = () => {
	console.log("Deleting an employee: \n");
	const emSql = `SELECT * FROM employee`;
	db.query(emSql, (err, res) => {
		if (err) throw err;
		const emp = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
		inquirer
			.prompt([
				{
					type: "list",
					name: "delEmp",
					message: "Which employee would you like to delete?",
					choices: emp,
				},
			])
			.then((answer) => {
				const choiceEm = answer.delEmp;
				const sql = `DELETE FROM employee where id = ?`;
				db.query(sql, choiceEm, (err, res) => {
					if (err) throw err;
					console.log("Deleted ${choiceEm} form employee list");
					viewEmployees();
				});
			});
	});
};
// function to view each department's total of employee salaries
viewBudget = ()=>{
    console.log("Showing each department's budget: \n");
    const sql = `SELECT department_id,
    department.name AS department,
    SUM(salary) as budget FROM roles
    JOIN department ON roles.department_id = department.id GROUP BY department_id`;
    db.query(sql, (err,rows)=>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};
