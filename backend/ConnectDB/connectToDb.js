import { MongoClient, ReadPreference } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_DB_URI;
let _db;

const connectToMongo = async function () {
  try {
    const options = {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,
      readPreference: 'secondary'
    };
    const client = new MongoClient(uri,options);
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

const getDb = () => {
  return _db;
};

export { connectToMongo, disconnect, getDb };
