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
  PRIMARY KEY
  (item_id)
);


  SELECT *
  FROM products;