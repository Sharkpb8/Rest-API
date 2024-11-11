import express from 'express'
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import { getBlog,getBlogs,createBlog,deleteBlog,updateBlog,createUser,CheckUser,GetBlogUser,AddAccess,CheckAccessUser,RemoveAccess,IsInAccess,IsAdmin,IsMyBlog } from './DBC.js'

const docYaml = YAML.load("./api.yaml");

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/about", swaggerUi.serve, swaggerUi.setup(docYaml));

app.get("/api/blog",async(req,res) => {
    let {username,password} = req.body || {};
    if (username == undefined) username = null;
    if (password == undefined) password = null;
    if(await CheckUser(username,password) < 1){
        const blogs = await getBlogs(null)
        return res.status(200).send(blogs)
    }else{
        const blogs = await getBlogs(username)
        return res.status(200).send(blogs)
    }
    
})

app.get("/api/blog/:id",async(req,res) => {
    const id =req.params.id
    const blogs = await getBlog(id)
    if(!blogs){
        return res.status(404).send({ message: "Blog not found" });
    }
    res.status(200).send(blogs)
})

app.post("/api/blog", async (req,res) =>{
    const {text,date,username,password} = req.body
    const id = await CheckUser(username,password)
    if(id < 1){
        return res.status(404).send({message: "User not found"});
    }
    await createBlog(id,text,date)
    res.status(200).send({message: "Blog created successfully"})
})

app.delete("/api/blog/:id",async(req,res) => {
    const id =req.params.id;
    const {username,password} = req.body;
    if(!await getBlog(id)){
        return res.status(404).send({ message: "Blog not found" });
    }
    if(await IsAdmin(username,password) >= 1){
        await deleteBlog(id)
        return res.status(200).send({message: "Blog deleted successfully"})
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
    if(await IsAdmin(username,password) >= 1){
        await updateBlog(id,text,date)
        return res.status(200).send({message: "Blog changed successfully"})
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

app.post("/api/access/:id", async(req,res) =>{
    const {username,password,adduser} = req.body
    const id =req.params.id
    if(!await getBlog(id)){
        return res.status(404).send({ message: "Blog not found" });
    }

    if(!await CheckAccessUser(adduser)){
        return res.status(404).send({message: "Trying to add user that doesnt exist"});
    }

    if(await IsAdmin(username,password) >= 1){
        await AddAccess(id,adduser)
        return res.status(200).send({message: "Access added successfully"})
    }

    if(!await IsMyBlog(id,username)){
        return res.status(403).send({message: "Trying to add access to blog that isnt yours"});
    }

    if(await CheckUser(username,password) < 1){
        return res.status(404).send({message: "User not found"});
    }else{
        await AddAccess(id,adduser)
        return res.status(200).send({message: "Access added successfully"})
    }
})

app.delete("/api/access/:id", async(req,res) =>{
    const {username,password,removeuser} = req.body
    const id =req.params.id
    if(!await getBlog(id)){
        return res.status(404).send({ message: "Blog not found" });
    }

    if(!await IsInAccess(removeuser)){
        return res.status(404).send({message: "Trying to remove user that doesnt have access"});
    }

    if(await IsAdmin(username,password) >= 1){
        await RemoveAccess(id,removeuser)
        return res.status(200).send({message: "Access removed successfully"})
    }

    if(!await IsMyBlog(id,username)){
        return res.status(403).send({message: "Trying to remove access to blog that isnt yours"});
    }

    if(await CheckUser(username,password) < 1){
        return res.status(404).send({message: "User not found"});
    }else{
        await RemoveAccess(id,removeuser)
        return res.status(200).send({message: "Access removed successfully"})
    }
})

app.use((err, req, res, next) =>{
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(8080,() =>{
    console.log("Server is running on port 8080")
})