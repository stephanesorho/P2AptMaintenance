const { MongoClient } = require("mongodb");

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

  try {
    const res = await users
      .find({}, { "request.title": 1, "request.request_id": 1, user_id: 1 })
      .sort({ "request.request_id": 1 })
      .limit(20)
      .toArray();

    console.log("dbConnector got requests", res);
    return res;
  } finally {
    await client.close();
  }
}

async function getRequestById(request_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users
      .find(
        { "request.request_id": parseInt(request_id) },
        { "request.title": 1, "request.request_id": 1, user_id: 1 }
      )
      .limit(1)
      .toArray();

    console.log(res);

    return res;
  } finally {
    await client.close();
  }
}

async function updateRequest(request_id, newRequest) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

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

    return res;
  } finally {
    await client.close();
  }
}

async function deleteRequest(request_id) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  try {
    const res = await users.deleteOne({
      "request.request_id": parseInt(request_id),
    });

    return res;
  } finally {
    await client.close();
  }
}

async function createRequest(newRequest) {
  const client = new MongoClient(url);

  const myDB = client.db(DB_NAME);
  const users = myDB.collection(COLLECTION_NAME);

  const lastId = await users.countDocuments({});

  try {
    const res = await users.insertOne({
      user_id: lastId + 1,
      "request.title": newRequest.title,
      "request.request_id": newRequest.request_id,
      user_id: newRequest.user_id,
    });

    return res;
  } finally {
    await client.close();
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
