const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT;

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
    await client.connect();
    const db = client.db('mediqueue');
    const tutorCollection = db.collection('tutor');

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

    
    app.get('/tutors', async (req, res) => {
      try {
        const { search, subject, mode } = req.query;

        
        const query = {};

        if (subject) {
          query.subject = subject;
        }

  
        if (mode) {
          query.mode = mode;
        }


        const tutors = await tutorCollection.find(query).toArray();
        res.json(tutors);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch all tutors' });
      }
    });

    app.get('/add-tutor', (req, res) => {
      res.send('tutors are adding');
    });

    app.post('/add-tutor', async (req, res) => {
      const tutorsData = req.body;
      const result = await tutorCollection.insertOne(tutorsData);
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});