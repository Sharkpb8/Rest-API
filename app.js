import express from 'express'
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { getBlog,getBlogs,createBlog,deleteBlog,updateBlog,createUser,CheckUser,GetBlogUser,AddAccess } from './DBC.js'

const docYaml = YAML.load("./api.yaml");

const app = express()
app.use(express.json())
app.use("/api/about", swaggerUi.serve, swaggerUi.setup(docYaml));

app.get("/api/blog",async(req,res) => {
    const {username,password} = req.body;
    if(await CheckUser(username,password) < 1){
        return res.status(404).send({message: "User not found"})
    }
    const blogs = await getBlogs(username)
    return res.status(200).send(blogs)
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
    await createBlog(autor,text,date)
    res.status(200).send({message: "Blog created successfully"})
})

app.delete("/api/blog/:id",async(req,res) => {
    const id =req.params.id;
    const {username,password} = req.body;
    if(!await getBlog(id)){
        return res.status(404).send({ message: "Blog not found" });
    }
    const user_id = await GetBlogUser(id);
    if(await CheckUser(username,password) != user_id){
        return res.status(403).send({message: "Not allowed"})
    }else{
        await deleteBlog(id)
        return res.status(200).send({message: "Blog deleted successfully"})
    }
    
})

app.patch("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const {text,date,username,password} = req.body
    if(!await getBlog(id)){
        return res.status(404).send({ message: "Blog not found" });
    }
    const user_id = await GetBlogUser(id);
    if(await CheckUser(username,password) != user_id){
        return res.status(403).send({message: "Not allowed"})
    }else{
        await updateBlog(id,text,date)
        return res.status(200).send({message: "Blog changed successfully"})
    }
    
})

app.post("/api/user", async (req,res) =>{
    const {username,password} = req.body
    await createUser(username,password)
    res.status(200).send({message: "User created successfully"})
})


app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(8080,() =>{
    console.log("Server is running on port 8080")
})