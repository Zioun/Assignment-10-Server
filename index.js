const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const artAndCraftCollection = client.db("artAndCraftDB").collection("artAndCraft");

    // get
    app.get("/artAndCraft", async (req, res) => {
      const cursor = artAndCraftCollection.find();
      const reslut = await cursor.toArray();
      res.send(reslut);
    });
    //get single item
    app.get("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artAndCraftCollection.findOne(query);
      res.send(result);
    });
    //post
    app.post("/artAndCraft", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const reslut = await artAndCraftCollection.insertOne(newCoffee);
      res.send(reslut);
    });
    //update
    app.put("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedArtAndCraft = req.body;
      const coffee = {
        $set: {
          itemName: updatedArtAndCraft.itemName,
          subCategory: updatedArtAndCraft.subCategory,
          rating: updatedArtAndCraft.rating,
          price: updatedArtAndCraft.price,
          customization: updatedArtAndCraft.customization,
          stockStatus: updatedArtAndCraft.stockStatus,
          photoURL: updatedArtAndCraft.photoURL,
          processingTime: updatedArtAndCraft.processingTime,
          details: updatedArtAndCraft.details,
        },
      };
      const result = await artAndCraftCollection.updateOne(filter, coffee, options);
      res.send(result);
    });
    //delete
    app.delete("/artAndCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artAndCraftCollection.deleteOne(query);
      res.send(result);
    });

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
