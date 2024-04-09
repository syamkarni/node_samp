const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = new sqlite3.Database(path.join(__dirname, 'user_info.db'));

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

app.use(bodyParser.json()); // Use bodyParser.json() middleware instead

app.post('/submit', (req, res) => {
    const { name, age, email } = req.body;
    console.log('Received data:', req.body); // Log the received data
    const sql = `INSERT INTO users (name, age, email) VALUES (?, ?, ?)`;
    db.run(sql, [name, age, email], (err) => {
        if (err) {
            console.error('Error inserting record:', err.message);
            res.status(500).send('Error inserting record');
        } else {
            console.log('Record inserted successfully');
            res.status(200).send('Record inserted successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
