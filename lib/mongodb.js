// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://hgsparkle015:6bjf7Ec3ZMat6YWI@ecomm.w78wy.mongodb.net/CRUDOP-WITH-NEXTJS-17-10-2024?retryWrites=true&w=majority&appName=Ecomm'; // Your MongoDB connection string
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that MongoClient is not constantly created during hot reloading
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's safe to create a new MongoClient
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
