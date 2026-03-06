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
  host: "localhost",
  user: "root",
  password: "", // XAMPP default empty
  database: "yflix"
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

// Test karne ke liye ek dummy rasta
app.get("/test-add", (req, res) => {
  const sql = "INSERT INTO users (name, email, password) VALUES ('Test User', 'test@gmail.com', '123456')";
  db.query(sql, (err, result) => {
    if (err) return res.send("Database Error: " + err.message);
    res.send("<h1>Manual Data Save Ho Gaya! phpMyAdmin check karo.</h1>");
  });
});