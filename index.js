const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// ahadaiman2

// 10GTjVm140uG6lGE

console.log(process.env.DB_USER);


// const uri = "mongodb+srv://ahadaiman2:10GTjVm140uG6lGE@cluster1.gvlvc6q.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.gvlvc6q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const coffeeCollection = client.db('ahadaiman2').collection('coffee');


    app.post('/addcoffee',async(req,res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      console.log(result);
      res.send(result);
    })

    app.get('/coffee', async(req,res)=>{
      const result = await coffeeCollection.find({}).toArray();
      console.log(result);
      res.send(result)


    })
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:new ObjectId(id)}

      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })
    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const existingCoffee = req.body;
      console.log(existingCoffee);
      const query = {_id: new ObjectId(id)}
      const options = {
        upsert:true
      }
      const updatedCoffee = {
        $set:{
          name:existingCoffee.name,
          chef:existingCoffee.chef,
          supplier:existingCoffee.supplier,
          taste:existingCoffee.taste,
          category:existingCoffee.category,
          details:existingCoffee.details,
          price:existingCoffee.price,
          photoUrl:existingCoffee.photoUrl
        }
      }
      const result = await coffeeCollection.updateOne(query,updatedCoffee,options)
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("Coffee store server running")
})

app.listen(port,()=>{
    console.log(`coffee server is run on port ${port}`);
})