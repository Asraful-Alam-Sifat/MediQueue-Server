const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

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
  }
});

async function run() {
  try {
    // Connect the client to the server (Vercel will reuse this connection where possible)
    await client.connect();
    
    const db = client.db('mediqueue');
    const tutorCollection = db.collection('tutor');

    // 1. Get Featured Tutors Route
    app.get('/featured-tutors', async (req, res) => {
      try {
        const tutors = await tutorCollection.aggregate([
          { $limit: 6 }
        ]).toArray();
        res.json(tutors);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch featured tutors' });
      }
    });

    // 2. Get All Tutors Route
    app.get('/tutors', async (req, res) => {
      try {
        const tutors = await tutorCollection.find().toArray();
        res.json(tutors);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch tutors' });
      }
    });

    // 3. Test Add-Tutor Route (GET)
    app.get('/add-tutor', (req, res) => {
      res.send('tutors are adding');
    });

    // 4. Add Tutor Route (POST)
    app.post('/add-tutor', async (req, res) => {
      try {
        // FIXED: Extract the body data correctly. 
        // In your screenshot, 'tutorsData' wasn't defined, so we fallback to req.body.
        const tutorsData = req.body; 
        const result = await tutorCollection.insertOne(tutorsData);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add tutor' });
      }
    });

    // Test MongoDB ping connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // CRITICAL FOR VERCEL: Do NOT close the client connection here.
    // If you close it, subsequent serverless requests won't be able to talk to MongoDB.
    // // await client.close();
  }
}

// Run the database configuration
run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
  res.send('Server Running');
});

// For Local Development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;