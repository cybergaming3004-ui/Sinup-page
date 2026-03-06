const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // CORS error fix karne ke liye

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Isse frontend aur backend connect ho payenge

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
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) console.error("❌ Table error: ", err);
            else console.log("✅ Table 'users' taiyar hai!");
        });
    }
});

// 2. Signup Route
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // 'name' ko 'username' column mein daalna hai
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log("❌ DB Error:", err.message);
      return res.status(500).json({ success: false, message: "Database error: " + err.message });
    }
    res.json({ success: true, message: "Account successfully ban gaya!" });
  });
});

// Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});