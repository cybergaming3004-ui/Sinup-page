const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Isse cross-origin errors nahi aayenge

// 1. MySQL Connection (Railway Details)
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
        
        // Auto-create Table (Username column fixed)
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) console.error("❌ Table error: ", err);
            else console.log("✅ Table 'users' ready!");
        });
    }
});

// 2. Signup Route
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Sahi Query: 'name' ko 'username' column mein insert kar rahe hain
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log("❌ DB Error:", err.message);
      // Agar email pehle se hai (Duplicate entry error)
      if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: "Email pehle se register hai!" });
      }
      return res.status(500).json({ success: false, message: "Server error! Baad mein try karein." });
    }
    res.json({ success: true, message: "Account successfully ban gaya!" });
  });
});

// Port setting for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});