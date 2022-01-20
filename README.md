# employee-tracker

## Description
The purpose of this project was to create a command line applicaton that can create/edit/remove employees and the possible roles/departments/manager. The application uses node.js, inquirer, and MySQL to create and store the data. Once the app is started, the user is prompted with a list of actions to perform. When selected via the command line, the user is prompted to input relevant information. Once all the information is added, the data is stored in a mySQL database called employee_db. If it is the first time running, the user must connect to MySQL and run the schema and seeds file to create the database. While creating this application, i learned how to utilize MySQL and inquirer for user input database storage. I also learned how to change/delete data stored in the database.

## Table of Contents 
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)

## Installation
In order to run this application, the inquirer, mysql2, and console.table packages need to be installed. If there is no package.json file, run npm init in the integrated terminal. If it is the user's first time running the app, they need to run mysql -u root -p. Then type in the password and run the command source schema.sql; followed by source seeds.sql;. The packages can be installed by running npm i package-name. Once installed, the app can be run by entering a node server.js or npm start command.

## Usage
Here is the link to the video tutorial on how to operate/set up the application.  
[Video tutorial app link](https://drive.google.com/file/d/1KdvomWFBUOK05UtkIEGZ1dKNib49emzh/view?usp=sharing)

When the application is started, the user is prompted with a list of possible actions. Manuever the options with the arrows and select with Enter. 

![list of options](./assets/images/options.png)

After each action is completed, a console message is generated and the related table is logged. 

![table produced](./assets/images/table.png)


## Credits

1. [MDN](https://developer.mozilla.org/en-US/)
2. [W3](https://www.w3schools.com/)
3. [inquirer.js](https://www.npmjs.com/package/inquirer)
4. [MySQL](https://dev.mysql.com/doc/)
5. [StackOverflow](https://stackoverflow.com/)
6. [Youtube](https://www.youtube.com/watch?v=NAG29V9oLpM)


## License
![License](./LICENSE)

## Features
1. Command-Line app
2. Options to add, update, or delete employees, roles, and departments
3. Saved data to 3 tables in a MySQL database

## How to Contribute
If there are any suggestions to improve this generator, this is my [GitHub](https://github.com/MaxStump13) account. 
