const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Setup collection pointers cleanly
let db;
let tutorCollection;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Initialize collections immediately upon connection
    db = client.db("mediqueue");
    tutorCollection = db.collection("tutor");

    // Ping test
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Invoke database connection
run().catch(console.dir);

// ==========================================
// ALL ROUTES SIT CLEANLY IN GLOBAL SCOPE
// ==========================================

// Root Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Featured Tutors Route
app.get("/featured-tutors", async (req, res) => {
  try {
    if (!tutorCollection) {
      // Fallback fallback pointer optimization if collection isn't loaded instantly
      tutorCollection = client.db("mediqueue").collection("tutor");
    }
    const tutors = await tutorCollection.aggregate([{ $limit: 6 }]).toArray();
    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch featured tutors" });
  }
});

// All Tutors Route
app.get("/tutors", async (req, res) => {
  try {
    if (!tutorCollection) {
      tutorCollection = client.db("mediqueue").collection("tutor");
    }
    const tutors = await tutorCollection.find().toArray();
    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tutors" });
  }
});

// Test Add Route
app.get("/add-tutor", (req, res) => {
  res.send("tutors are adding");
});

// Post Route
app.post("/add-tutor", async (req, res) => {
  try {
    if (!tutorCollection) {
      tutorCollection = client.db("mediqueue").collection("tutor");
    }
    const tutorsData = req.body;
    const result = await tutorCollection.insertOne(tutorsData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add tutor" });
  }
});

// Clean local app listener setup 
app.listen(port, () => {
  console.log(`Server is running smoothly on port ${port}`);
});

// Export module for Vercel Serverless environment
module.exports = app;