const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

async function getCommonRequest() {
  try {
    const myDB = client.db("aptMaintenance");
    const users = myDB.collection("tenants");

    //Query for finding the most common request with the number of occurences
    const query = await users
      .aggregate([
        {
          $group: {
            _id: "$request.title",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    console.log(query);
  } finally {
    await client.close();
  }
}

getCommonRequest();
