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



LOAD DATA LOCAL INFILE '/Users/alex/Documents/PREWORK_AMS/ASSIGNMENTS FOR SUB/homework_11/Instructions/bamazon/initial.csv'
-- -- '/Users/alex/Documents/PREWORK_AMS/CLASS/CLASS102219/Week12-Day03-TopMusic/Top1000Songs.csv' 
-- INTO TABLE products;

-- SHOW VARIABLES LIKE "secure_file_priv";

  SELECT *
  FROM products;