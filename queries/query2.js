const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

//Ranking top 5 cheapest contractors by their labor cost
async function rankByLaborCost() {
  try {
    const myDB = client.db("aptMaintenance");
    const users = myDB.collection("tenants");

    const query2 = { "contractor.labor_cost": 1 };
    const ranked = await users.find({}, query2).sort(query2).toArray();

    const distinct = new Set();

    for (let i = 0; i < ranked.length; i++) {
      const contractor = ranked[i].contractor.name;
      const cost = ranked[i].contractor.labor_cost;
      if (!distinct.has(contractor)) {
        console.log("Contractor", contractor, "'s labor cost is $", cost);
        distinct.add(contractor);

        if (distinct.size === 5) {
          break;
        }
      }
    }
  } finally {
    await client.close();
  }
}

rankByLaborCost();
