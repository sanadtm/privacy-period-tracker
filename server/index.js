require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Database Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API Route: Fetch Period Tracking Data
app.get("/api/periods", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM periods ORDER BY cycle_start DESC");
        console.log("++++++++++++ ",result.rows)
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// // ✅ API Route: Add New Period Data
// app.post("/api/periods11", async (req, res) => {
//     const { user_id, cycle_start, cycle_end, cycle_length, ovulation_date, pregnancy, body_weight, body_temperature, height } = req.body;
//     try {
//         const result = await pool.query(
//             "INSERT INTO periods (user_id, cycle_start, cycle_end, cycle_length, ovulation_date, pregnancy, body_weight, body_temperature, height) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
//             [user_id, cycle_start, cycle_end, cycle_length, ovulation_date, pregnancy, body_weight, body_temperature, height]
//         );
//         res.json(result.rows[0]);
//         console.log("------- ",result.rows[0])
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });
app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
