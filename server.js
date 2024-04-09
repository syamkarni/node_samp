const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 module
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'user_info.db'));

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    email TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created successfully');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', (req, res) => {
    const { name, age, email } = req.body;
    const sql = `INSERT INTO users (name, age, email) VALUES (?, ?, ?)`;
    db.run(sql, [name, age, email], (err) => {
        if (err) {
            console.error('Error inserting record:', err.message);
            res.status(500).send('Error inserting record');
        } else {
            console.log('Record inserted successfully');
            res.redirect('/success.html');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});