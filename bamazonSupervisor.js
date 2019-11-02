/**
 * @see {@link https://www.npmjs.com/package/mysql}
 */
const mysql = require('mysql');
const inquirer = require('inquirer');
const keys = require('./keys.js');
const Table = require('easy-table');

const sqlKey = (keys.SQL.Pass);

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: sqlKey,
    database: 'bamazon_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    doCRUD();
});

/**
 * Called by callback function upon successful establishment of DB connection.
 * @see {@link https://www.npmjs.com/package/mysql#performing-queries}
 */

function doCRUD() {
    getUserInputAsync();

}

/**
 * Get the user input using Inquirer lib
 * @return {Promise} an Inquirer promise that resolves with
 * an answers object
 */


function getUserInputAsync() {

    return inquirer.prompt([
        {
            name: 'type',
            message: 'Welcome! Would you like to:',
            type: 'list',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            default: 'View Product Sales by Department',
        },
    ]).then(function (inquirerResponse) {
        console.log(inquirerResponse.type);
        // getUserInputAsync(inquirerResponse.type);
        switch (inquirerResponse.type) {
            case 'View Product Sales by Department':
                viewProductSalesByDepartment();
                break;

            case 'Create New Department':
                createNewDepartment();
                break;

            case 'Exit':
                exitBamazon();
                break;
        }
    }
    );
}

function viewProductSalesByDepartment() {
    
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_cost, SUM(IFNULL (products.product_sales, 0.00)) AS product_sales, SUM(IFNULL ( products.product_sales, 0.00)) - departments.over_head_cost AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_cost;", function (err, res) {
        if (err){
consile.log(err);
        } else {
        // Create our new table.
        var t = new Table

        // Build storefront from our SQL data.
        res.forEach(function (product) {
            t.cell("\n")
            t.cell("Department ID", product.department_id)
            t.cell("Department Name", product.department_name)
            t.cell("Overhead Costs", product.over_head_costs)
            t.cell("Product Sales", product.product_sales)
            t.cell("Profit", product.total_profit)

            // Execute Build.
            t.newRow()
        
        });
        console.log(t.toString());
    }
    });
    
};

function createNewDepartment() {

    return inquirer.prompt([
        {
            name: 'department_name',
            message: 'What is the new department? \n',
        },
        {
            name: 'over_head_costs',
            message: 'What are the overhead costs? \n',
        },
        {
            name: 'product_sales',
            message: 'How much has been sold already? \n',
        },
        {
            name: 'total_profit',
            message: 'How much profit is there  already? \n',
        },
    ]).then(function (inquirerResponse) {
        // console.log(inquirerResponse.order);

        const query = connection.query(

            'INSERT INTO departments SET ?',
            [
                {
                    department_name: inquirerResponse.department_name,
                    over_head_cost: inquirerResponse.over_head_costs,
                    product_sales: inquirerResponse.product_sales,
                    total_profit: inquirerResponse.total_profit,
                },
  
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' products updated!\n');
                // Call deleteProduct AFTER the UPDATE completes
                displayTable();
                console.log(inquirerResponse.department_name);
                console.log(inquirerResponse.over_head_costs);
                console.log(inquirerResponse.product_sales);
                console.log(inquirerResponse.total_profit);
            }
        );
    }
    )

getUserInputAsync();
}



function displayTable() {

    console.log('\n Bamazon Inventory:\n');

    connection.query("Select * FROM departments", function (error, results) {
        if (error) throw error;

        var t = new Table;
        results.forEach(function (department) {
            t.cell('department_id', department.department_id);
            t.cell('department_name', department.department_name);
            t.cell('over_head_costs', department.over_head_costs);
            t.cell('product_sales', department.product_sales);
            t.cell('total_profit', department.total_profit);
            
            t.newRow();
        });

        console.log(t.toString());
        console.log('\n \n');
        getUserInputAsync();

    })

};



function exitBamazon() {
    console.log("Good bye!");
    connection.end();
};
