const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

//Aggregation query
//Query to obtain the total cost per contractors
async function contractorsCosts() {
  try {
    const myDB = client.db("aptMaintenance");
    const users = myDB.collection("tenants");

    const requests = await users
      .aggregate([
        {
          $match: {
            "contractor.available": "Yes",
          },
        },

        {
          $group: {
            _id: "$contractor.name",
            costTotal: { $sum: "$contractor.labor_cost" },
          },
        },
        {
          $project: {
            _id: 1,
            costTotal: "$costTotal",
          },
        },
        {
          $sort: { cost: -1 },
        },
      ])
      .toArray();

    console.log(requests);
  } finally {
    await client.close();
  }
}

contractorsCosts();
