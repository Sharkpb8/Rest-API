import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database:  process.env.database
}).promise()

export async function getBlogs(){
    const result = await pool.query("select * from blogs")
    const rows = result[0]
    return rows
}

export async function getBlog(id){
    const result = await pool.query("select * from blogs where id = ?",[id]) 
    const rows = result[0]
    return rows[0]
}

export async function createBlog(autor,text,date){
    let result;
    if(date != null){
        [result] = await pool.query("insert into blogs (autor,text,date) values(?,?,?)",[autor,text,date]);
    }else{
        [result] = await pool.query("insert into blogs (autor,text) values(?,?)",[autor,text]);
    }
    
    return result.insertId
}

export async function deleteBlog(id){
    const result = await pool.query("delete from blogs where id = ?",[id])
    return result
}

export async function updateBlog(id,autor,text,date){
    const temp = await getBlog(id)
    if(autor == null){
        autor = temp.autor
    }
    if(text == null){
        text = temp.text
    }
    if(date == null){
        date = temp.date
    }
    const result = await pool.query("update blogs set autor = ?, text = ?, date = ? where id = ?",[autor,text,date,id])
    return result
}

/* const notes = await getNodes()
console.log(notes) */

/* const note = await getNode(1)
console.log(note) */

/* const result = await createNode("martin","zaspal jsem","2024-10-25")    
console.log(result) */