import { Client } from "pg";
import { config } from "dotenv";

config(); // Memuat variabel dari .env

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("Connected to Supabase!");
    const res = await client.query('SELECT * FROM "User" LIMIT 1');
    console.log("Sample user:", res.rows);
    await client.end();
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testConnection();
