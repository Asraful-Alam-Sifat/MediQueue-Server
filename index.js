const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let tutorCollection;
let bookingCollection;

async function run() {
  try {
    await client.connect();

    db = client.db("mediqueue");
    tutorCollection = db.collection("tutor");
    bookingCollection = db.collection("bookings");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

run().catch(console.dir);

// Root Route - API Directory Dashboard

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MediQueue API Server</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 40px; margin: 0; }
            .container { max-width: 650px; margin: 0 auto; background: #161b22; padding: 30px; border-radius: 12px; border: 1px border #30363d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            h1 { color: #58a6ff; margin-top: 0; display: flex; align-items: center; gap: 10px; }
            .status { display: inline-block; background: rgba(46, 160, 67, 0.15); color: #3fb950; padding: 4px 10px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 1px solid rgba(46, 160, 67, 0.3); }
            p { color: #8b949e; line-height: 1.6; }
            .route-list { margin-top: 25px; border-top: 1px solid #30363d; padding-top: 20px; }
            .route-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #21262d; margin-bottom: 8px; border-radius: 6px; border: 1px solid transparent; transition: 0.2s; }
            .route-item:hover { border-color: #388bfd; }
            .method { font-weight: bold; font-size: 12px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
            .get { background: rgba(56, 139, 253, 0.15); color: #58a6ff; }
            .post { background: rgba(188, 143, 255, 0.15); color: #bc8fff; }
            .put { background: rgba(219, 109, 40, 0.15); color: #db6d28; }
            .delete { background: rgba(248, 81, 73, 0.15); color: #f85149; }
            .url { font-family: monospace; font-size: 14px; color: #e6edf3; text-decoration: none; }
            .url:hover { text-decoration: underline; }
            .desc { font-size: 13px; color: #8b949e; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>🏥 MediQueue API Server</h1>
                <span class="status">● Active</span>
            </div>
            <p>Welcome to the central backend processor for the MediQueue platform. Below are the available service endpoints you can query directly or monitor database outputs with:</p>
            
            <div class="route-list">
                <h3>Available Endpoints</h3>
                
                <div class="route-item">
                    <div>
                        <a href="/tutors" target="_blank" class="url">/tutors</a>
                        <div class="desc">Retrieves all registered tutors from the database</div>
                    </div>
                    <span class="method get">GET</span>
                </div>

                <div class="route-item">
                    <div>
                        <a href="/featured-tutors" target="_blank" class="url">/featured-tutors</a>
                        <div class="desc">Retrieves a limited list of 6 premium tutors</div>
                    </div>
                    <span class="method get">GET</span>
                </div>

                <div class="route-item">
                    <div>
                        <a href="/bookings" target="_blank" class="url">/bookings</a>
                        <div class="desc">Fetches all raw user queue bookings</div>
                    </div>
                    <span class="method get">GET</span>
                </div>

                <div class="route-item">
                    <div>
                        <span class="url" style="cursor: default;">/add-tutor</span>
                        <div class="desc">Appends new instructor profiles to database payloads</div>
                    </div>
                    <span class="method post">POST</span>
                </div>

                <div class="route-item">
                    <div>
                        <span class="url" style="cursor: default;">/tutors/:id</span>
                        <div class="desc">Updates structural specifications for a distinct listing ID</div>
                    </div>
                    <span class="method put">PUT</span>
                </div>

                <div class="route-item">
                    <div>
                        <span class="url" style="cursor: default;">/tutors/:id</span>
                        <div class="desc">Permanently purges a tutor listing record from MongoDB</div>
                    </div>
                    <span class="method delete">DELETE</span>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Featured Tutors Route
app.get("/featured-tutors", async (req, res) => {
  try {
    if (!tutorCollection) {
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

// Post Route to add a tutor
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

// edit tutor listing Route
app.put("/tutors/:id", async (req, res) => {
  try {
    if (!tutorCollection) {
      tutorCollection = client.db("mediqueue").collection("tutor");
    }

    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };

    delete updatedData._id;

    const updateDoc = {
      $set: updatedData,
    };

    const result = await tutorCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to update tutor:", error);
    res
      .status(500)
      .json({ message: "Failed to update tutor data", error: error.message });
  }
});

// delete route to remove a tutor document by ID
app.delete("/tutors/:id", async (req, res) => {
  try {
    if (!tutorCollection) {
      tutorCollection = client.db("mediqueue").collection("tutor");
    }

    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await tutorCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Tutor document not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to delete tutor:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete tutor listing",
        error: error.message,
      });
  }
});

// Booking Session post Route
app.post("/bookings", async (req, res) => {
  try {
    if (!bookingCollection) {
      bookingCollection = client.db("mediqueue").collection("bookings");
    }

    const { email, tutorId, subject } = req.body;

    if (!email || !tutorId || !subject) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory fields: email, tutorId, or subject.",
      });
    }

    const existingBooking = await bookingCollection.findOne({
      email: email,
      tutorId: tutorId,
      subject: subject,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You have already booked a session with this tutor for this subject!",
      });
    }

    const result = await bookingCollection.insertOne(req.body);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Failed to insert booking data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error saving booking",
      });
  }
});

// GET Route to fetch all bookings (Viewable in Browser)
app.get("/bookings", async (req, res) => {
  try {
    if (!bookingCollection) {
      bookingCollection = client.db("mediqueue").collection("bookings");
    }

    const bookings = await bookingCollection.find().toArray();
    res.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
});

// GET Route for my-tutors - Fetches only the tutors created by a specific user email
app.get("/my-tutors", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    if (!tutorCollection) {
      tutorCollection = client.db("mediqueue").collection("tutor");
    }

    const query = { userEmail: email };
    const result = await tutorCollection.find(query).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error in /my-tutors route:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running smoothly on port ${port}`);
});

// Export module for Vercel Serverless environment
module.exports = app;
