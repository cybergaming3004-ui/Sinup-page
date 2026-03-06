const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middleware: Form data aur JSON samajhne ke liye
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 1. MySQL Connection (yflix database)
const db = mysql.createConnection({
    host: 'mysql.railway.internal',      // Railway se copy karo
    user: 'root',      // Railway se copy karo
    password: 'NGyKywLsGPAfWCvJjjgxjyKOmmpyVGhc', 
    database: 'railway', 
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ', err);
    } else {
        console.log('Connected to Railway Database!');
        
        // YE CODE APNE AAP TABLE BANA DEGA
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error("Table banane mein error: ", err);
            } else {
                console.log("Table 'users' bilkul taiyar hai!");
            }
        });
    }
});

// 2. Signup Route: Script.js se data yahan aayega
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log("❌ Error:", err.message);
      return res.status(500).json({ success: false, message: "Email pehle se exist karta hai ya server error!" });
    }
    console.log("🎉 Naya user save ho gaya!");
    res.json({ success: true, message: "Account successfully ban gaya!" });
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});




