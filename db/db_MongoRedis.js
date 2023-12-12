const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const url = "mongodb://localhost:27017";

const DB_NAME = "aptMaintenance";
const COLLECTION_NAME = "tenants";

async function getUsers() {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users
      .find({}, { user_id: 1, name: 1, apt_number: 1, email: 1 })
      .sort({ user_id: 1 })
      .limit(50)
      .toArray();

    console.log("dbConnector got users", res);
    return res;
  } finally {
    await client.close();
  }
}

async function getUserById(user_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users
      .find(
        { user_id: parseInt(user_id) },
        { user_id: 1, name: 1, apt_number: 1 }
      )
      .limit(1)
      .toArray();

    console.log(res);

    return res;
  } finally {
    await client.close();
  }
}

async function updateUser(user_id, newUser) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users.updateOne(
      { user_id: parseInt(user_id) },
      {
        $set: {
          name: newUser.name,
          apt_number: newUser.apt_number,
          email: newUser.email,
        },
      }
    );

    return res;
  } finally {
    await client.close();
  }
}

async function deleteUser(user_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users.deleteOne({ user_id: parseInt(user_id) });

    return res;
  } finally {
    await client.close();
  }
}

async function createUser(newUser) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  const lastId = await users.countDocuments({});

  try {
    const res = await users.insertOne({
      user_id: lastId + 1,
      name: newUser.name,
      apt_number: newUser.apt_number,
      email: newUser.email,
    });

    return res;
  } finally {
    await client.close();
  }
}

// *********** REQUESTS *********** //
async function getRequests() {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  //Connect to redis client
  let redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
  console.log("Connected to Redis Client");

  await redisClient.del("requests");
  await redisClient.del("userReq");

  try {
    console.log("get request from backend");
    const res = await users
      .find({})
      .project({
        request_title: "$request.title",
        request_id: "$request.request_id",
        user_id: 1,
      })
      .limit(20)
      .toArray();

    //add requests to redis
    for (let i = 0; i < res.length; i++) {
      const reqId = "request:" + res[i].request_id;
      const title = res[i].request_title;
      const userId = res[i].user_id;
      await redisClient.hSet("request", {
        [reqId]: title,
      });
      //await redisClient.rPush("userReq", "user_id:" + userId + ":" + reqId);
    }

    // //add requests to redis
    // for (let i = 0; i < res.length; i++) {
    //   const reqId = res[i].request_id;
    //   const title = res[i].request_title;
    //   await redisClient.zAdd("requests", {
    //     score: reqId,
    //     value: title,
    //   });
    // }

    //console.log("dbConnector got requests", res);
    return res;
  } catch (err) {
    console.log("error", err);
  } finally {
    await client.close();
    //Disconnect from redis
    await redisClient.disconnect();
  }
}

async function getRequestById(request_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  //Connect to redis client
  let redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
  console.log("Connected to Redis Client");

  try {
    const res = await users
      .find(
        { "request.request_id": parseInt(request_id) },
        { "request.title": 1, "request.request_id": 1, user_id: 1 }
      )
      .limit(1)
      .toArray();

    console.log(res);

    const redisId = await redisClient.get("request:" + request_id);
    console.log(redisId);

    return res;
  } finally {
    await client.close();
  }
}

async function updateRequest(request_id, newRequest) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  //Connect to redis client
  let redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
  console.log("Connected to Redis Client");

  try {
    const res = await users.updateOne(
      { "request.request_id": parseInt(request_id) },
      {
        $set: {
          "request.title": newRequest.title,
          "request.request_id": newRequest.request_id,
        },
      }
    );

    const key = "request:" + request_id;

    await redisClient.hSet("request", {
      [key]: newRequest.request_title,
    });

    return res;
  } finally {
    await client.close();
    //Disconnect from redis
    await redisClient.disconnect();
  }
}

async function deleteRequest(request_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  //Connect to redis client
  let redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
  console.log("Connected to Redis Client");

  try {
    const res = await users.deleteOne({
      "request.request_id": parseInt(request_id),
    });

    await redisClient.del("request", {
      [key]: newRequest.request_title,
    });

    return res;
  } finally {
    await client.close();
    //Disconnect from redis
    await redisClient.disconnect();
  }
}

async function createRequest(newRequest) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  //Connect to redis client
  let redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
  console.log("Connected to Redis Client");

  try {
    const res = await users.insertOne({
      "request.title": newRequest.title,
      "request.request_id": newRequest.request_id,
      user_id: newRequest.user_id,
    });

    const newKey = "request:" + newRequest.request_id;

    await redisClient.hSet("request", {
      [newKey]: newRequest.request_title,
    });

    return res;
  } finally {
    await client.close();
    //Disconnect from redis
    await redisClient.disconnect();
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  createRequest,
};
