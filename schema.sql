DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
  item_id INT NOT NULL
  AUTO_INCREMENT,
  product_name VARCHAR
  (45) NULL,
  department_name VARCHAR
  (45) NULL,
  price FLOAT
  (45) NULL,
  stock_quantity FLOAT
  (10) NULL,
  product_sales FLOAT
  (10) NULL,
  PRIMARY KEY
  (item_id)
);

ALTER TABLE products ADD product_sales FLOAT
  (45) NOT NULL;

  SELECT *
  FROM products;

  CREATE TABLE departments
(
  department_id INT NOT NULL
  AUTO_INCREMENT,
  department_name VARCHAR
  (45) NULL,
  over_head_cost FLOAT
  (10) NULL,
   product_sales FLOAT
  (10) NULL,
   total_profit FLOAT
  (10) NULL,
  PRIMARY KEY
  (department_id)
);

SELECT departments.department_id, departments.department_name, departments.over_head_cost, SUM(IFNULL (products.product_sales, 0.00)) AS product_sales, SUM(IFNULL ( products.product_sales, 0.00)) - departments.over_head_cost AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_cost;

  SELECT *
  FROM departments;