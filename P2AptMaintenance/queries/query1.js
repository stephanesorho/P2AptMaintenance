const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

async function countCurrentMaintenances() {
  try {
    const myDB = client.db("aptMaintenance");
    const users = myDB.collection("tenants");

    //Query for counting documents
    const query1 = { "maintenance.status": "In-Progress" };
    const count = await users.countDocuments(query1);

    console.log(`Number of maintenances in progress: ${count}`);
  } finally {
    await client.close();
  }
}

countCurrentMaintenances();
