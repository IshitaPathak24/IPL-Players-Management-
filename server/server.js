const dbConnect = require('./mongodb');
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const app = express();

app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.get('/',async (res,resp)=>{
    let data = await dbConnect();
    data= await data.find().toArray();
    console.log(data)
    resp.send(data);
});


app.post("/", async (req,resp)=>{
    let data = await dbConnect();
    let result = await data.insertOne(req.body)
    console.log(result)
    resp.send(result)

})

app.put("/:id", async (req, resp) => {
    try {
      const data = await dbConnect();
      const result = await data.updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
      console.log(result);
      resp.send(result);
    } catch (error) {
      console.error("Error updating player:", error);
      resp.status(500).send("Internal Server Error");
    }
  });
  
app.delete("/:id", async (req,resp)=>{
    let data = await dbConnect();
    let result = await data.deleteOne(
       {_id: new mongodb.ObjectId(req.params.id)}
    )
    console.log(result)
    resp.send({result: "update"})

})

app.listen(5500)