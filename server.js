const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname))); // Ye HTML/CSS files dikhane ke liye hai

// MySQL Connection
const db = mysql.createConnection({
    host: 'mysql.railway.internal', 
    user: 'root', 
    password: 'NGyKywLsGPAfWCvJjjgxjyKOmmpyVGhc', 
    database: 'railway', 
    port: 3306,
});

db.connect((err) => {
    if (err) console.error('❌ DB Error:', err);
    else {
        console.log('✅ Connected to Railway!');
        db.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);
    }
});

// Main Page Route (Cannot GET fix)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Signup Route
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Account successfully ban gaya!" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));