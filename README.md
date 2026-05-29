#  MediQueue API Server

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://medi-queue-server-bd.vercel.app)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-lightgrey?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com)

Welcome to the central backend processor for the **MediQueue** platform. This server acts as the core API layer, handling data persistence, managing tutor profiles, processing user bookings, and interacting securely with MongoDB.

🔗 **Live API Server:** [https://medi-queue-server-bd.vercel.app](https://medi-queue-server-bd.vercel.app)

---

## 🚀 Features

* **Tutor Management:** Complete CRUD operations for handling tutor listings.
* **Queue Bookings:** Secure processing and structural logging of raw user queue bookings.
* **Database Integration:** Scalable document storage and fast querying via MongoDB.
* **Production Ready:** Fully optimized and configured for seamless deployment on Vercel.

---

## 🛠️ Tech Stack

* **Backend Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via official MongoDB NodeJS Driver)
* **Deployment:** Vercel

---

## 📋 API Endpoints

Below are the available service endpoints you can query directly or monitor database outputs with:

### 👤 Tutor Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tutors` | Retrieves all registered tutors from the database. |
| `GET` | `/featured-tutors` | Retrieves a limited list of 6 premium tutors. |
| `POST` | `/bookings` | Appends new instructor profiles to database 


