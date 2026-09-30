const express = require("express");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML files from Public folder
app.use(express.static("Public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud_db"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// VIEW students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).send("Database error");
        }

        res.json(results);
    });
});

// ADD student
app.post("/students", (req, res) => {
    const { name, email, course } = req.body;

    const sql =
        "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";

    db.query(sql, [name, email, course], (err) => {
        if (err) {
            return res.status(500).send("Error adding student");
        }

        res.redirect("/");
    });
});

// UPDATE student
app.post("/students/update/:id", (req, res) => {
    const { name, email, course } = req.body;
    const id = req.params.id;

    const sql =
        "UPDATE students SET name=?, email=?, course=? WHERE id=?";

    db.query(sql, [name, email, course, id], (err) => {
        if (err) {
            return res.status(500).send("Error updating student");
        }

        res.redirect("/");
    });
});

// DELETE student
app.get("/students/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM students WHERE id=?",
        [id],
        (err) => {
            if (err) {
                return res.status(500).send("Error deleting student");
            }

            res.redirect("/");
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});