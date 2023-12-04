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

  const newId = await users.countDocuments({});

  try {
    const res = await users.insertOne({
      user_id: newId + 1,
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
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT title, request_id, user_id
    FROM Request
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":request_id": request_id,
    });

    const request = await stmt.all();

    await stmt.finalize();

    return request;
  } finally {
    await db.close();
  }
}

async function updateRequest(request_id, newRequest) {
  console.log("update request request_id ", request_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`UPDATE Request
    SET
      title = :title
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":title": newRequest.title,
      ":request_id": request_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function deleteRequest(request_id) {
  console.log("deleting request ", request_id);
  const db = await connect();

  try {
    const stmt = await db.prepare(`DELETE FROM Request
    WHERE
      request_id = :request_id
  `);

    stmt.bind({
      ":request_id": request_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createRequest(newRequest) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`INSERT INTO
    Request(title, request_id, user_id)
    VALUES (:title, :request_id, :user_id)
  `);

    stmt.bind({
      ":title": newRequest.title,
      ":request_id": newRequest.request_id,
      ":user_id": newRequest.user_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
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
