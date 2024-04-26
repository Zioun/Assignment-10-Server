const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nl88zl6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("artAndCraftDB").collection("artAndCraft");
    // const userCollection = client.db("coffeeDB").collection("user");

    //get
    // app.get("/addArtAndCraft", async (req, res) => {
    //   const cursor = coffeeCollection.find();
    //   const reslut = await cursor.toArray();
    //   res.send(reslut);
    // });
    //get single item
    // app.get("/coffee/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await coffeeCollection.findOne(query);
    //   res.send(result);
    // });
    //post
    app.post("/addArtAndCraft", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const reslut = await coffeeCollection.insertOne(newCoffee);
      res.send(reslut);
    });
    //update
    // app.put("/coffee/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedCoffee = req.body;
    //   const coffee = {
    //     $set: {
    //       name: updatedCoffee.name,
    //       quantity: updatedCoffee.quantity,
    //       supplier: updatedCoffee.supplier,
    //       taste: updatedCoffee.taste,
    //       category: updatedCoffee.category,
    //       details: updatedCoffee.details,
    //       photo: updatedCoffee.photo,
    //     },
    //   };
    //   const result = await coffeeCollection.updateOne(filter, coffee, options);
    //   res.send(result);
    // });
    //delete
    // app.delete("/coffee/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await coffeeCollection.deleteOne(query);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
