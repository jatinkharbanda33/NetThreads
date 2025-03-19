import { MongoClient } from "mongodb";
import config from "../Config/config.js"
import logger from "../utils/logger.js";

const uri = config.MONGO_DB_URI;
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
    logger.info("connectToDb.js: Connected to MongoDB");
  } catch (error) {
    console.error("connectToDb.js: Error connecting to MongoDB:", error.message);
    logger.error("connectToDb.js: Error connecting to MongoDB: " + error.message);
  }
};

const disconnect = async () => {
  if (_db) {
    _db.close();
    console.log("Disconnected from MongoDB");
    logger.info("connectToDb.js: Disconnected from MongoDB");
  }
};

const getDb = () => {
  return _db;
};

export { connectToMongo, disconnect, getDb };
