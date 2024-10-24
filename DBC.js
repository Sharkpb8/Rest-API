import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database:  process.env.database
}).promise()

async function getNodes(){
    const result = await pool.query("select * from blogs")
    const rows = result[0]
    return rows
}

async function getNode(id){
    const result = await pool.query("select * from blogs where id = ?",[id]) 
    const rows = result[0]
    return rows[0]
}

async function createNode(autor,text,date){
    const [result] = await pool.query("insert into blogs (autor,text,date) values(?,?,?)",[autor,text,date])
    return result.insertId
}

/* const notes = await getNodes()
console.log(notes) */

/* const note = await getNode(1)
console.log(note) */

const result = await createNode("martin","zaspal jsem","2024-10-25")
console.log(result)