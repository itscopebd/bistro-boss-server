const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const userCollection = client.db("BistroDb").collection("users");

        app.get("/menu", async (req, res) => {

            const result = await menuCollection.find().toArray();
            res.send(result)
        })


        // users apis


        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post("/users", async (req, res) => {

            const data = req.body;
            const existingEmail = data.email;
            // console.log(existingEmail)
            const query = { email: existingEmail }
            const existingUser = await userCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: "User Already Existing" });
                // console.log(existingUser)
            }

           else{
            const result = await userCollection.insertOne(data);
            res.send(result)
           }
        })

        // get cart data 
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            if (!email) {
                res.send([])
            }

            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        // carts data 

        app.post("/carts", async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await cartCollection.insertOne(data);
            res.send(result)
        })

        // delete 
        app.delete("/del/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
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