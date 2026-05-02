import { MongoClient } from "mongodb";

let db;

export async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db("taskflow");
  console.log("Connected to MongoDB successfully");

  // Create indexes for better performance
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("tasks").createIndex({ userId: 1 });

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return db;
}
