const express = require("express");
const mysql = require("mysql2/promise");

const server = express();

server.use(express.json());

// 1. What is the Event Loop?
// The Event Loop is the mechanism in Node.js that allows it to perform non-blocking I/O operations,
//  even though JavaScript is single-threaded.
//  It continuously checks the call stack and the callback queue,
//  and whenever the stack is empty,
// it takes the first callback from the queue and pushes it to the stack for execution.

// 2. What is Libuv?
// Libuv is a C library that Node.js uses to handle asynchronous,
//  non-blocking operations like file system access,
// networking, and timers.
// It provides the Event Loop implementation
//  and manages the Thread Pool for operations that can't be done asynchronously at the OS level.

// 3. How Does Node.js Handle Async Operations Under the Hood?
// When an async operation (like reading a file or a database query) is called,
//  Node.js delegates it to libuv.
//  Libuv either uses the OS's async capabilities or the Thread Pool to complete the task in the background.
//  Once done, the result is placed in the callback queue, and the Event Loop picks it up when the call stack is empty.

// 4. Call Stack vs Event Queue vs Event Loop
// Call Stack: Where synchronous code executes, function by function, in a Last-In-First-Out (LIFO) order.
// Event Queue (Callback Queue): Where completed async callbacks wait until the Call Stack is empty.
// Event Loop: The process that constantly checks the Call Stack and moves callbacks from the Event Queue to the Call Stack when it's empty.

// 5. What is the Thread Pool and How to Set Its Size?
// The Thread Pool is a set of background threads (provided by libuv) used to run heavy or blocking operations,
// such as file system tasks, DNS lookups, and some crypto functions, without blocking the main thread.
// By default, it has 4 threads.

// 6. Blocking vs Non-Blocking Code Execution
// Blocking code executes synchronously and stops further code from running until it finishes
//Non-blocking code executes asynchronously,
// allowing the rest of the code to continue running while the operation completes in the background,
//  and the result is handled later via a callback, promise, or async/awai

// ============ part 3 ========== //
// 1.
const bootstrapPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  connectionLimit: 1,
});

let pool;

async function bootstrap() {
  try {
    await bootstrapPool.query("CREATE DATABASE IF NOT EXISTS retail_store");

    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "retail_store",
      connectionLimit: 10,
    });
    const Suppliers = await pool.query(`CREATE TABLE IF NOT EXISTS Suppliers(
      SupplierID INT PRIMARY KEY AUTO_INCREMENT,
      SupplierName VARCHAR(50),
      ContactNumber VARCHAR(50)
      );`);
    const Products = await pool.query(`CREATE TABLE IF NOT EXISTS Products(
      ProductID INT PRIMARY KEY AUTO_INCREMENT,
      ProductName VARCHAR(50),
      Price decimal(10,2),
      StockQuantity INT,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
      );`);
    const Sales = await pool.query(`CREATE TABLE IF NOT EXISTS Sales(
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
      );`);
    console.log("DB connected");
    server.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  } catch (error) {
    console.log("DB connection failed");
    console.log(error);
  }
}

bootstrap();

// 2
// Creat Product.
server.post("/products", async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const [insertProduct] = await pool.query(
      `INSERT INTO Products (ProductName,Price,StockQuantity,SupplierID) values (?,?,?,?)`,
      [ProductName, Price, StockQuantity, SupplierID],
    );
    res.status(201).json({ insertProduct: insertProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Retrieve all products.

server.get("/products", async (req, res) => {
  try {
    const [retrieveAll] = await pool.query(`SELECT * FROM Products`);
    res.json({ retrieveAll: retrieveAll });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Retrieve a product by ID.
server.get("/products/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const [retrieveId] = await pool.query(
      `SELECT ProductName FROM Products where ProductID = ? `,
      [ProductID],
    );
    res.status(200).json({ retrieveId: retrieveId });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "something went wrong" });
  }
});

// Update a product.

server.patch("/products/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const { Price } = req.body;
    const [updateProduct] = await pool.query(
      `UPDATE Products set Price = ? where ProductID = ?`,
      [Price, ProductID],
    );
    res.status(200).json({ updateProduct: updateProduct });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "something went wrong" });
  }
});

// Delete a product.

server.delete("/products/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const [deletProduct] = await pool.query(
      `DELETE FROM Products where ProductID = ?`,
      [ProductID],
    );
    res.status(200).json({ deletProduct: deletProduct });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "something went wrong" });
  }
});

// 2.

// Create Suppliers

server.post("/suppliers", async (req, res) => {
  try {
    const { SupplierID, SupplierName, ContactNumber } = req.body;
    const [addSupplier] = await pool.query(
      `INSERT INTO Suppliers (SupplierName,ContactNumber) values (?,?)`,
      [SupplierName, ContactNumber],
    );
    res.status(201).json({ addSupplier: addSupplier });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Retrieve all suppliers.

server.get("/suppliers", async (req, res) => {
  try {
    const [allSuppliers] = await pool.query(`SELECT * FROM Suppliers`);
    res.status(200).json({ allSuppliers: allSuppliers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Update supplier information.

server.patch("/suppliers/:SupplierID", async (req, res) => {
  try {
    const { SupplierID } = req.params;
    const { SupplierName, ContactNumber } = req.body;
    const [updateSuupliers] = await pool.query(
      `UPDATE Suppliers set SupplierName = ?, ContactNumber =? where SupplierID = ?`,
      [SupplierName, ContactNumber, SupplierID],
    );
    res.status(200).json({ updateSuupliers: updateSuupliers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Delete a supplier.

server.delete("/suppliers/:SupplierID", async (req, res) => {
  try {
    const { SupplierID } = req.params;
    await pool.query(`DELETE FROM Products where SupplierID = ?`, [SupplierID]);
    const [deleteSupplier] = await pool.query(
      `DELETE FROM Suppliers where SupplierID = ?`,
      [SupplierID],
    );
    res.status(200).json({ msg: "Supplier and related products deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 4.

// Record a sale.

server.post("/sales", async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    const [recordSale] = await pool.query(
      `INSERT INTO Sales (ProductID,QuantitySold,SaleDate) values (?,?,?)`,
      [ProductID, QuantitySold, SaleDate],
    );
    res.status(200).json({ recordSale: recordSale });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Retrieve all sales.

server.get("/sales", async (req, res) => {
  try {
    const [retrieveAll] = await pool.query(`SELECT * FROM Sales`);
    res.status(200).json({ retrieveAll: retrieveAll });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Retrieve sales for a specific product.

server.get("/sales/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const [retrieveId] = await pool.query(
      `SELECT ProductID FROM Sales where ProductID = ?`,
      [ProductID],
    );
    res.status(200).json({ retrieveId: retrieveId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 5

// Add a Category column to the Products table.

server.patch("/AddColumn", async (req, res) => {
  try {
    const [addColumn] = await pool.query(
      `alter table Products add Category varchar(50)`,
    );
    res.status(200).json({ addColumn: addColumn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Remove the Category column.

server.delete("/removeCloumn", async (req, res) => {
  try {
    const [removeColumn] = await pool.query(
      `alter table Products drop column Category`,
    );
    res.status(200).json({ removeColumn: removeColumn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Change ContactNumber to VARCHAR(15).

server.patch("/changeContactNumber", async (req, res) => {
  try {
    const [change] = await pool.query(
      `alter table Suppliers MODIFY column ContactNumber VARCHAR(15)`,
    );
    res.status(200).json({ change: change });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Add a NOT NULL constraint to ProductName.

server.patch("/changeContactNumber", async (req, res) => {
  try {
    const [change] = await pool.query(
      `alter table Suppliers MODIFY column ProductName NOT NULL`,
    );
    res.status(200).json({ change: change });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 6
// a.
// Add a supplier with the name 'FreshFoods' and contact number '01001234567'.

server.post("/add_supplier", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    const [addSupplier] = await pool.query(
      `INSERT INTO Suppliers (SupplierName,ContactNumber) values(?,?)`,
      [SupplierName, ContactNumber],
    );
    res.status(200).json({ addSupplier: addSupplier });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// Insert the following three products, all provided by 'FreshFoods':

// b.
// i. 'Milk' with a price of 15.00 and stock quantity of 50.
// ii. 'Bread' with a price of 10.00 and stock quantity of 30.
// iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
server.post("/add_products/:SupplierID", async (req, res) => {
  try {
    const { SupplierID } = req.params;
    const { ProductName, Price, StockQuantity } = req.body;
    const [addProduct] = await pool.query(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)`,
      [ProductName, Price, StockQuantity, SupplierID],
    );
    res.status(200).json({ addProduct: addProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

//c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.

server.post("/addSale/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const { QuantitySold, SaleDate } = req.body;
    const [addSale] = await pool.query(
      `INSERT INTO Sales (ProductID,QuantitySold,SaleDate) values (?,?,?)`,
      [ProductID, QuantitySold, SaleDate],
    );
    res.status(200).json({ addSale: addSale });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 7. Create an API endpoint to update the price of 'Bread' to 25.00.

server.patch("/updatePrice/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const { Price } = req.body;
    const [updatePrice] = await pool.query(
      `UPDATE Products set Price = ? where ProductID = ?`,
      [Price, ProductID],
    );
    res.status(200).json({ updatePrice: updatePrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 8. Create an API endpoint to delete the product 'Eggs'.

server.delete("/deletProduct/:ProductID", async (req, res) => {
  try {
    const { ProductID } = req.params;
    const [deletProduct] = await pool.query(
      `DELETE FROM Products where ProductID = ?`,
      [ProductID],
    );
    res.status(200).json({ deletProduct: deletProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 9. Create a reporting endpoint to retrieve the total quantity sold for each product using SQL aggregate functions.
server.get("/totalQuantitySold", async (req, res) => {
  try {
    const [totalQuantitySold] = await pool.query(
      `SELECT ProductID, SUM(QuantitySold) FROM Sales GROUP BY ProductID`,
    );
    res.status(200).json({ totalQuantitySold: totalQuantitySold });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 10. Create a reporting endpoint to retrieve the product with the highest stock quantity.
server.get("/highest-stock-quantity", async (req, res) => {
  try {
    const [highestStockQuantity] = await pool.query(
      `SELECT ProductID, ProductName, StockQuantity
       FROM Products
       where StockQuantity = (SELECT MAX(StockQuantity) FROM Products)
       #LIMIT 1
      `,
    );
    res.status(200).json({ highestStockQuantity: highestStockQuantity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 11. Create a reporting endpoint to retrieve suppliers whose names start with 'F'.

server.get("/suppliers-start-with-F", async (req, res) => {
  try {
    const [StartF] = await pool.query(
      `SELECT * FROM Suppliers where SupplierName like 'F%'`,
    );
    res.status(200).json({ StartF: StartF });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 12. Create a reporting endpoint to retrieve all products that have never been sold.

server.get("/Products-never-sold", async (req, res) => {
  try {
    const [ProductsNeverSold] = await pool.query(
      `SELECT * FROM Sales where QuantitySold = 0`,
    );
    res.status(200).json({ ProductsNeverSold: ProductsNeverSold });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 13 Create a reporting endpoint to retrieve all sales including
// ● Product name
// ● Quantity sold
// ● Sale date using SQL JOIN operations.

server.get("/retrieve-join", async (req, res) => {
  try {
    const [retrieveJoin] = await pool.query(
      `SELECT ProductName, QuantitySold, SaleDate FROM Products LEFT OUTER JOIN Sales ON Products.ProductID = Sales.ProductID`,
    );
    res.status(200).json({ retrieveJoin: retrieveJoin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 14. Create a SQL script or secure administrative endpoint to create a MySQL user named store_manager and grant the
// following permissions on all tables
// ● SELECT
// ● INSERT
// ● UPDATE

server.post("/create-store-manager", async (req, res) => {
  try {
    const { password, database } = req.body;
    const [creatResult] = await pool.query(
      `CREATE USER 'store_manager'@'localhost' IDENTIFIED BY ?;
       GRANT SELECT, INSERT, UPDATE ON \`${database}\`.* TO 'store_manager'@'localhost';`,
      [password],
    );
    res.status(200).json({
      msg: "store_manager user created successfully",
      creatResult: creatResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 15. Revoke the UPDATE permission from “store_manager”.

server.patch("/Revoke-update", async (req, res) => {
  try {
    const [revokeResult] = await pool.query(
      `REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost'`,
    );
    res.status(200).json({ revokeResult: revokeResult });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});

// 16. Grant DELETE permission to “store_manager” only on the Sales table.

server.patch("/delete", async (req, res) => {
  try {
    const [deleteResult] = await pool.query(
      `GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost'`,
    );
    res.status(200).json({ deleteResult: deleteResult });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong" });
  }
});
