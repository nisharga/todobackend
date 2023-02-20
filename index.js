const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//mondodb_Clint start
const uri = `mongodb+srv://Nisharga:aDj8QSwONIMYsWtK@cluster0.qemdz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//mondodb_Clint end

app.get("/", (req, res) => {
  res.send("I Love Express.");
});

app.get("/name/:id", (req, res) => {
  res.send("Selected Person is:" + req.params.id);
});

app.listen(port, () => {
  console.log("port listen");
});

async function run() {
  try {
    await client.connect();
    const dbCollection = client.db("sattyl").collection("todo");
    app.post("/addtodo", async (req, res) => {
      const data = req.body;
      const result = await dbCollection.insertOne(data);
      console.log(result, "Create a Todo on DataBase");
    });
    app.get("/todos", async (req, res) => {
      const query = { status: "create" };
      //   status: "create"
      const cursor = dbCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.get("/todos/pending", async (req, res) => {
      const query = { status: "pending" };
      const cursor = dbCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.get("/todos/completed", async (req, res) => {
      const query = { status: "completed" };
      const cursor = dbCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.get("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = dbCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.put("/todos/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const data = req.body;
      const update = { $set: data };
      const options = { upsert: true };
      const result = await dbCollection.updateOne(query, update, options);
      console.log(data, "todo pending updated");
    });
    app.put("/todos/completed/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const data = req.body;
      const update = { $set: data };
      const options = { upsert: true };
      const result = await dbCollection.updateOne(query, update, options);
      console.log(data, "complete todo updated");
    });
    app.delete("/todos/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await dbCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Sucessfully deleted ");
      }
      res.send(result);
    });
  } finally {
    //        await client.close()
  }
}
run().catch(console.dir);
