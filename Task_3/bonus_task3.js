const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "retail_store",
});

async function getCustomersWithoutTransactions() {
  try {
    const [rows] = await pool.query(`
      SELECT Visits.customer_id, COUNT(*) AS count_no_trans
      FROM Visits
      LEFT JOIN Transactions ON Visits.visit_id = Transactions.visit_id
      WHERE Transactions.visit_id IS NULL
      GROUP BY Visits.customer_id
    `);

    console.log("Done");
    console.log(rows);
  } catch (error) {
    console.error("Error running query:", error);
  } finally {
    await pool.end();
  }
}

getCustomersWithoutTransactions();
