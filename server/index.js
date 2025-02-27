require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Database Connection (Now Uses `.env` + SSL for Render)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // ✅ Required for Render PostgreSQL
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API Route: Fetch Period Tracking Data
app.get("/api/periods", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM periods ORDER BY cycle_start DESC");
        console.log("++++++++++++ ", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ API Route: Fetch Users
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        console.log("++++++++++++ ", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ API Route: Test Backend
app.get("/", (req, res) => {
    res.json({ message: "Backend is running and connected to PostgreSQL!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
