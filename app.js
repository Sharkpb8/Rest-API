import express from 'express'
import { getBlog,getBlogs,createBlog,deleteBlog,updateBlog } from './DBC.js'

const app = express()
app.use(express.json())

app.get("/api/blog",async(req,res) => {
    const blogs = await getBlogs()
    res.send(blogs)
})

app.get("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const blogs = await getBlog(id)
    if(!blogs){
        res.status(404).send({ message: "Blog not found" });
    }
    res.send(blogs)
})

app.post("/api/blog", async (req,res) =>{
    const {autor,text,date} = req.body
    const blogs = await createBlog(autor,text,date)
    res.status(201).send(blogs)
})

app.delete("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const blogs = await deleteBlog(id)
    if(!await getBlog(id)){
        res.status(404).send({ message: "Blog not found" });
    }else{
        res.send(blogs)
    }
    
})

app.patch("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const {autor,text,date} = req.body
    const blogs = await updateBlog(id,autor,text,date)
    if(!await getBlog(id)){
        res.status(404).send({ message: "Blog not found" });
    }else{
        res.send(blogs)
    }
    
})

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(8080,() =>{
    console.log("Server is running on port 8080")
})