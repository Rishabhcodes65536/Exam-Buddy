// import redis from "redis";

// // Create a Redis client
// const redisClient = redis.createClient();

// redisClient.on("error", (err) => {
//   console.log(err.message);
// });

// redisClient.on("ready", () => {
//   console.log("Redis is ready");
// });

// redisClient.on("end", () => {
//   console.log("Redis connection ended");
// });

// redisClient
//   .connect()
//   .then(() => {
//     console.log("Connected to Redis");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// export default redisClient;
import redis from "redis";

// Function to create and connect Redis client using promises
const createRedisClient = () => {
  return new Promise((resolve, reject) => {
    // Create Redis client
    const redisClient = redis.createClient({
      host: "localhost", // Redis server host
      port: 6379, // Redis server port
      // Add other options as needed, such as password if Redis server requires authentication
    });

    // Handle Redis client events
    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
      reject(err); // Reject promise on error
    });

    redisClient.on("ready", () => {
      console.log("Redis client is ready");
      resolve(redisClient); // Resolve promise on successful connection
    });

    redisClient.on("end", () => {
      console.log("Redis connection ended");
    });

    // Connect to Redis
    redisClient.connect().catch(reject); // Catch and reject any connection errors
  });
};

// Export function to create Redis client
export default createRedisClient;
