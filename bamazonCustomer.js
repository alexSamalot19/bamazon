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
    displayTable();
  
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
      choices: ['Order', 'Exit'],
      default: 'Order',
    },
  ]).then(function (inquirerResponse) {
    console.log(inquirerResponse.type);
    // getUserInputAsync(inquirerResponse.type);
    switch (inquirerResponse.type) {
      case 'Order':
        placeOrder();
        break;

      case 'Exit':
        exitBamazon();
        break;
    }
  }


  );
}

function placeOrder() {
    
  return inquirer.prompt([
    {
      name: 'order',
      message: 'What would you like to order? \n',
    },
    {
      name: 'orderAmount',
      message: 'how much would you like? \n',
    },
  ]).then(function (inquirerResponse) {
    console.log(inquirerResponse.order);

    const query = connection.query(
      'SELECT * FROM products WHERE ?',
      [
        {
          item_id: inquirerResponse.order,
        },
      ],
      function (err, res) {
        if (err) throw err;

        let orderID = inquirerResponse.orderAmount;
        if (inquirerResponse.orderAmount < res[0].stock_quantity) {
          let newStock = res[0].stock_quantity - inquirerResponse.orderAmount;
          let orderBill = res[0].price * orderID;
          console.log("Your order total is: $" + orderBill);
          updateProduct(newStock, orderID);

        } else {
          console.log("Insufficient Quantity!")
          getUserInputAsync()
        }

        // }
      }


    );
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
console.log("You're order has been placed! \n")
  getUserInputAsync();
}



function displayTable(){

  console.log('\n Bamazon Inventory:\n');

    connection.query("Select * FROM products", function(error,results){
        if (error) throw error;

        var t = new Table;
        results.forEach(function(product){
            t.cell('item_id', product.item_id);
            t.cell('product_name', product.product_name);
            t.cell('department_name', product.department_name);
            t.cell('price', product.price);
            t.cell('stock_quantity', product.stock_quantity);
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
