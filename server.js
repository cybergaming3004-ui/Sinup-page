const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// STATIC FILES: Isse HTML/CSS/JS Render par dikhne lagenge
app.use(express.static(__dirname)); 

// 1. MySQL Connection (Railway)
const db = mysql.createConnection({
    host: 'mysql.railway.internal', 
    user: 'root', 
    password: 'NGyKywLsGPAfWCvJjjgxjyKOmmpyVGhc', 
    database: 'railway', 
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection error: ', err);
    } else {
        console.log('✅ Connected to Railway Database!');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;
        db.query(createTableQuery, (err) => {
            if (err) console.error("❌ Table error: ", err);
            else console.log("✅ Table 'users' ready!");
        });
    }
});

// 2. HOME ROUTE: Isse "Cannot GET /" theek ho jayega
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 3. SIGNUP ROUTE
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log("❌ DB Error:", err.message);
      return res.status(500).json({ success: false, message: "Error: " + err.message });
    }
    res.json({ success: true, message: "Account successfully ban gaya!" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});