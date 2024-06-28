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


const createRedisClient = () => {
  return new Promise((resolve, reject) => {

    const redisClient = redis.createClient({
      host: "localhost", 
      port: 6379, 

    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
      reject(err); 
    });

    redisClient.on("ready", () => {
      console.log("Redis client is ready");
      resolve(redisClient);
    });

    redisClient.on("end", () => {
      console.log("Redis connection ended");
    });

   
    redisClient.connect().catch(reject);
  });
};

export default createRedisClient;
