import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_DB_URI;
let _db;

const connect = async function () {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    _db = client.db("Threads");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

const disconnect = async () => {
  if (_db) {
    _db.close();
    console.log("Disconnected from MongoDB");
  }
};

const getDb = async () => {
  return _db;
};

export { connect, disconnect, getDb };
