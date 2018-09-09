var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mniekk1!",
  database: "bamazon"
});

var total_purchase = 0


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayItems()
});


function displayItems() {
  console.log("Welcome to Bamazon");
  console.log("Here's what's in stock:")
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
          res[i].item_id +
          " || Name: " +
          res[i].product_name +
          " || Price: " +
          res[i].price  +
          " || Stock: " +
          res[i].stock_quantity
      );
    };
    placeOrder()
  })
};


function placeOrder() {
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "Please enter the ID of the item you would like to buy",
        validate: function(value) {
          if (isNaN(value) === false && value <= 10) {
            return true;
          }
          return false;
        }
      },
      {
        name: "itemQuantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var itemID = parseInt(answer.itemID)
      var itemQuantity = parseInt(answer.itemQuantity)
      console.log("Updating cart...")
      connection.query("SELECT * FROM products WHERE ?",
      {
        item_id: itemID
      }, function(err, res) {
      console.log(res)
      if (itemQuantity < res[0].stock_quantity) {
          total_purchase = (itemQuantity * res[0].price)
          connection.query("UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: res[0].stock_quantity - itemQuantity
          },
          {
            item_id: itemID
          }
        ], function(err, res){
          console.log("Thank you, your purchase total is $" + total_purchase);
          console.log("Enjoy!")
          connection.end()
        });
      }
      else {
        console.log("I'm sorry we do not have enough stock of that item!")
        connection.end()
      }
    });
  })
};
