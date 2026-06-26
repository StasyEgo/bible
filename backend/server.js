const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS checks(
 id INTEGER PRIMARY KEY,
 checked INTEGER NOT NULL
)
`);

app.get("/checks", (req,res)=>{
    db.all("SELECT * FROM checks", [], (err, rows)=>{
        if(err) return res.status(500).send(err);
        res.json(rows);
    });
});

app.post("/checks",(req,res)=>{
    const {id, checked} = req.body;

    db.run(`
    INSERT INTO checks(id, checked)
    VALUES(?,?)
    ON CONFLICT(id)
    DO UPDATE SET checked=?
    `,
    [
        id,
        checked ? 1 : 0,
        checked ? 1 : 0
    ],
    err=>{
        if(err) return res.status(500).send(err);
        res.json({success:true});
    });
});

app.listen(3000, ()=>{
    console.log("Backend started on port 3000");
});