const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middle ware 

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.loltiyt.mongodb.net/?retryWrites=true&w=majority`;

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


        const menuCollection = client.db("BistroDb").collection("menu");
        const cartCollection = client.db("BistroDb").collection("carts");

        app.get("/menu", async (req, res) => {

            const result = await menuCollection.find().toArray();
            res.send(result)
        })

        // carts data 

        app.post("/carts", async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await cartCollection.insertOne(data);
            res.send(result)
        })





        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server Running")
})
app.listen(port, () => {
    console.log("Server Running")
})