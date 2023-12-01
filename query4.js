const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

async function updateUser() {
  try {
    const myDB = client.db("aptMaintenance");
    const users = myDB.collection("tenants");

    //Query for counting documents
    users.updateOne({ user_id: 3 }, { $set: { "request.title": "Broken AC" } });

    // console.log(`Number of maintenances in progress: ${count}`);
  } finally {
    await client.close();
  }
}

updateUser();
