const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


// чтобы backend мог отдавать index.html
app.use(express.static(path.join(__dirname, "../")));


const db = new sqlite3.Database("./database.db");


db.run(`
CREATE TABLE IF NOT EXISTS checks(
 id INTEGER PRIMARY KEY,
 checked INTEGER NOT NULL
)
`);



app.get("/", (req,res)=>{
    res.sendFile(
        path.join(__dirname,"../index.html")
    );
});



app.get("/checks",(req,res)=>{

    db.all(
        "SELECT * FROM checks",
        [],
        (err,rows)=>{

            if(err){
                res.status(500).send(err);
                return;
            }

            res.json(rows);
        }
    );

});



app.post("/checks",(req,res)=>{

    const {id,checked}=req.body;


    db.run(
    `
    INSERT INTO checks(id,checked)
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

        if(err){
            res.status(500).send(err);
            return;
        }

        res.json({
            success:true
        });

    });

});



app.listen(3000,()=>{
    console.log("Server started");
});
