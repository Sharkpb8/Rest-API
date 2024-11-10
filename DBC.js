import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database:  process.env.database,
    port: process.env.port
}).promise()

export async function getBlogs(username){
    if (username != null){
        const result = await pool.query("call viewblogs(?)",[username])
        const rows = result[0][0]
        return rows
    }else{
        const result = await pool.query("select * from blogs as b where b.id not in (select blogs_id from access) ")
        const rows = result[0]
        console.log(rows)
        return rows
    }
}

export async function getBlog(id){
    const result = await pool.query("select * from blogs where id = ?",[id]) 
    const rows = result[0]
    return rows[0]
}

export async function createBlog(id,text,date){
    let result;
    if(date != null){
        [result] = await pool.query("insert into blogs (uzivatel_id,text,date) values(?,?,?)",[id,text,date]);
    }else{
        [result] = await pool.query("insert into blogs (uzivatel_id,text) values(?,?)",[id,text]);
    }
    
    return result.insertId
}

export async function deleteBlog(id){
        const result = await pool.query("delete from blogs where id = ?",[id]);
        return result;
}

export async function updateBlog(id,text,date){
    const temp = await getBlog(id)
    if(text == null){
        text = temp.text
    }
    if(date == null){
        date = temp.date
    }
    const result = await pool.query("update blogs set text = ?, date = ? where id = ?",[text,date,id])
    return result
}

export async function CheckUser(username,password){
    if(username == null && password == null){return 0}
    let result = await pool.query("select password,id from uzivatel where username = ?;", [username]);
	if (result.length <= 0) return 0;
	const password_hash = result[0][0]["password"];
	if (!await bcrypt.compare(password, password_hash))
	{
		return 0;
	}
	return result[0][0]["id"];
}

export async function GetBlogUser(id){
    const result = await pool.query("select uzivatel_id from blogs where id = ?",[id]) 
    const rows = result[0]
    return rows[0]["uzivatel_id"]
}

export async function createUser(name,password){
    const password_hash = await bcrypt.hash(password, 10);
	const result = await pool.query("insert into uzivatel (username, password) values (?, ?);", [name, password_hash]);
	return result.insertId;
}

export async function AddAccess(id,user){
    const result = await pool.query("call addaccess (?, ?);", [id,user]);
	return result;
}

export async function CheckAccessUser(user){
    const result = await pool.query("select * from uzivatel where username = ?",[user]);
	if(result[0].length<=0){
        return false
    }else{
        return true
    }
}

export async function RemoveAccess(id,user){
    const result = await pool.query("delete from access where blogs_id = ? and uzivatel_id = (select id from uzivatel where username = ?);", [id,user]);
	return result;
}

export async function IsInAccess(user){
    const result = await pool.query("select * from access where uzivatel_id in (select id from uzivatel where username = ?)",[user])
    if(result[0].length<=0){
        return false
    }else{
        return true
    }
}

export async function IsAdmin(user,password){
    let result = await pool.query("select password,id from uzivatel where username = ? and admin = 1;", [user]);
	if (result[0].length <= 0) return 0;
	const password_hash = result[0][0]["password"];
	if (!await bcrypt.compare(password, password_hash))
	{
		return 0;
	}
	return result[0][0]["id"];
}

export async function IsMyBlog(id,user){
    let result = await pool.query("select * from blogs where id = ? and uzivatel_id in (select id from uzivatel where username = ?)",[id,user])
    if(result[0].length<=0){
        return false
    }else{
        return true
    }
}

/* const notes = await getNodes()
console.log(notes) */

/* const note = await getNode(1)
console.log(note) */

/* const result = await createNode("martin","zaspal jsem","2024-10-25")    
console.log(result) */