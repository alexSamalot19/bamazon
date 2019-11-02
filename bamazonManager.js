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
console.log('\n \n')
    return inquirer.prompt([
        {
            name: 'type',
            message: 'Manager Options:',
            type: 'list',
            choices: ['View Products for Sale', 'View Low Inventory',
                'Add to Inventory', 'Add New Product', 'Exit'],
            default: 'Order',
        },
    ]).then(function (inquirerResponse) {
        console.log(inquirerResponse.type);
        // getUserInputAsync(inquirerResponse.type);
        switch (inquirerResponse.type) {
            case 'View Products for Sale':
                viewProductsForSale();
                break;

            case 'View Low Inventory':
                viewLowInventory();
                break;

            case 'Add to Inventory':
                addToInventory();
                break;

            case 'Add New Product':
                addNewProduct();
                break;

            case 'Exit':
                exitBamazon();
                break;
        }
    }


    );
}

/**
 * Reads all products from the DB
 */
function viewProductsForSale() {
    console.log('Selecting all products...\n');
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        var t = new Table;
        res.forEach(function (product) {
            t.cell('item_id', product.item_id);
            t.cell('product_name', product.product_name);
            t.cell('department_name', product.department_name);
            t.cell('price', product.price);
            t.cell('stock_quantity', product.stock_quantity);
            t.cell('product_sales', product.product_sales);
            t.newRow();
        });

        console.log(t.toString());
        console.log('\n \n');
        getUserInputAsync();

    });
};

/**
 * Reads all products from the DB
 */
function viewLowInventory() {
    console.log('Selecting all products...\n');
    connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function (err, res) {
        if (err) throw err;

        var t = new Table;
        res.forEach(function (product) {
            t.cell('item_id', product.item_id);
            t.cell('product_name', product.product_name);
            t.cell('department_name', product.department_name);
            t.cell('price', product.price);
            t.cell('stock_quantity', product.stock_quantity);
            t.cell('product_sales', product.product_sales);
            t.newRow();

        
    });
    console.log(t.toString());
    console.log('\n \n');
    getUserInputAsync();
});
};

/**
 * Reads all products from the DB
 */
function addToInventory() {
    return inquirer.prompt([
        {
            name: 'Restock',
            message: 'What would you like to restock? \n',
        },
        {
            name: 'orderAmount',
            message: 'how much would you like to add? \n',
        },
    ]).then(function (inquirerResponse) {
        // console.log(inquirerResponse.order);

        const query = connection.query(
            'SELECT * FROM products WHERE ?',
            [
                {
                    item_id: inquirerResponse.Restock,
                },
            ],
            function (err, res) {
                if (err) throw err;

                let orderID = inquirerResponse.Restock;
                let newStock = parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.orderAmount);

                updateProduct(newStock, orderID);

            });
    }


    )
};



function updateProduct(newStock, orderID) {

    const query = connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity: newStock,
            },
            {
                item_id: orderID,
            },
        ],
        function (err, res) {
            if (err) throw err;


        }
    );

    // logs the actual query being run
    //   console.log(query.sql);
    console.log("You're stock has been updated! \n")
    getUserInputAsync();
}

/**
 * Reads all products from the DB
 */
function addNewProduct() {
    return inquirer.prompt([
        {
            name: 'product_name',
            message: 'What would you like to add? \n',
        },
        {
            name: 'department_name',
            message: 'What Department is it in? \n',
        },
        {
            name: 'price',
            message: 'How Much Does it Cost? \n',
        },
        {
            name: 'stock_quantity',
            message: 'How Many? \n',
        },
        {
            name: 'product_sales',
            message: 'How much has already been sold? \n',
        },
        
    ]).then(function (inquirerResponse) {
        // console.log(inquirerResponse.order);

        const query = connection.query(

            'INSERT INTO products SET ?',
            [
                {
                    product_name: inquirerResponse.product_name,
                    department_name: inquirerResponse.department_name,
                    price: inquirerResponse.price,
                    stock_quantity: inquirerResponse.stock_quantity,
                    product_sales: inquirerResponse.product_sales,
                },
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' products updated!\n');
                // Call deleteProduct AFTER the UPDATE completes
                viewProductsForSale();
            }
        );
    }
    )


};


function exitBamazon() {
    console.log("Good bye!");
    connection.end();
};
