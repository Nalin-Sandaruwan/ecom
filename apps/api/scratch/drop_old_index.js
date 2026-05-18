const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/chillebazzar";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('chillebazzar');
    const reviews = database.collection('reviews');
    
    console.log("Checking current indexes...");
    const indexes = await reviews.listIndexes().toArray();
    console.log("Current indexes:", indexes.map(i => i.name));

    const oldIndex = "productId_1_userId_1";
    if (indexes.some(i => i.name === oldIndex)) {
      console.log(`Dropping old index: ${oldIndex}`);
      await reviews.dropIndex(oldIndex);
      console.log("Index dropped successfully.");
    } else {
      console.log(`Old index ${oldIndex} not found.`);
    }

  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await client.close();
  }
}

run();
