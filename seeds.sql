INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Finance"),
    ("Legal"),
    ("Engineering")

INSERT INTO role (title, salary, department_id)
VALUES  
('Lead Engineer', 150000, 4),
('Software Engineer', 120000, 4),
('Accountant', 125000, 2), 
('Account Manager', 160000, 2),
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Legal Team Lead', 250000, 3);
("Lawyer", 190000, 3);

INSERT INTO emplpoyee (first_name, last_name, role_id, manager_id)

VALUES
("John","Doe", 5, NULL);
("Mike","Chan", 6, 1);
("Ashley","Rodriguez", 1, NULL);
("Kevin","Tupik", 2, 3);
("Kunal","Singh", 4, NULL);
("Malia","Brown", 3, 5);
("Sarah","Lourd", 7, NULL);
("Tom","Allen", 8, 7);