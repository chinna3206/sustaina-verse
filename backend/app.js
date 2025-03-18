require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const port = process.env.PORT || 5000;
const app=express();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT||5000;
const dbPath=path.join(__dirname,'users.db');

let db=null;
const initializeDBAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(PORT,async()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(e){
        console.log(`DB Error ${e.message}`);
    }
};

initializeDBAndServer();

const getUser=async(data)=>{
    console.log(data)
    const {username, password}=data;
    const getDBQuery=`SELECT * FROM users WHERE username='${username}' and password='${password}'`;
    const user=await db.get(getDBQuery);
    if(user){
        return {status:200, message: "Login Success"};
    }
    else{
        return {status:404, error: "User Not Found"};
    }
}

app.post('/login',async(req,res)=>{
    const result=await getUser(req.body);
    res.status(result.status).json(result);
});

const insertUser = async (data) => {
    const { username, password, email } = data;
    
    const checkUser = `SELECT * FROM users WHERE username = ? OR email = ?`;
    const user = await db.get(checkUser, [username, email]);

    if (user) {
        return { status: 409, error: "User already exists" };
    }

    const insertDBQuery = `INSERT INTO users(username, email, password) VALUES (?, ?, ?)`;
    try {
        await db.run(insertDBQuery, [username, email, password]);
        return { status: 200, message: "User successfully registered" };
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return { status: 409, error: "User already exists" };
        }
        return { status: 500, error: "Internal Server Error" };
    }
};

app.post('/register',async(req,res)=>{
    const result=await insertUser(req.body);
    res.status(result.status).json(result);
});