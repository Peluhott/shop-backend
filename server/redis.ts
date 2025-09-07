import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.error("Redis error:", err));

let isConnected = false; // make sure that each import doesn't start a server
export async function redisConnect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("Redis connected");
  }
}

export default client;



