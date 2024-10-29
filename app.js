import express from 'express'
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { getBlog,getBlogs,createBlog,deleteBlog,updateBlog,/* getUser,createUser */ } from './DBC.js'

const docYaml = YAML.load("./api.yaml");

const app = express()
app.use(express.json())
app.use("/api/about", swaggerUi.serve, swaggerUi.setup(docYaml));

app.get("/api/blog",async(req,res) => {
    const blogs = await getBlogs()
    res.status(200).send(blogs)
})

app.get("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const blogs = await getBlog(id)
    if(!blogs){
        res.status(404).send({ message: "Blog not found" });
    }
    res.status(200).send(blogs)
})

app.post("/api/blog", async (req,res) =>{
    const {autor,text,date} = req.body
    const blogs = await createBlog(autor,text,date)
    res.status(200).send(blogs)
})

app.delete("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    if(!await getBlog(id)){
        res.status(404).send({ message: "Blog not found" });
    }else{
        const blogs = await deleteBlog(id)
        res.status(200).send(blogs)
    }
    
})

app.patch("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const {autor,text,date} = req.body
    if(!await getBlog(id)){
        res.status(404).send({ message: "Blog not found" });
    }else{
        const blogs = await updateBlog(id,autor,text,date)
        res.status(200).send(blogs)
    }
    
})

/* app.get("/api/user", async (req,res) =>{
    const {username,password} = req.body
    const user = await getUser(username,password)
    if(user == null){
        res.status(404).send({message:"user not found"});
    }else{
        res.status(200).send(user)
    }
    
})

app.post("/api/user", async (req,res) =>{
    const {username,password} = req.body
    const user = await createUser(username,password)
    res.status(200).send(user)
}) */

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(8080,() =>{
    console.log("Server is running on port 8080")
})