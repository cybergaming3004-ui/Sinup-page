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
    console.log("❌ Database connect nahi hua:", err.message);
  } else {
    console.log("✅ MySQL Connected: yflix database ready hai!");
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
