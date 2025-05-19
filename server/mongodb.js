const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017';
const databaseName = 'ipl_team';
const client = new MongoClient(url);

async function dbConnect() {
  let result = await client.connect();
  const db = result.db(databaseName);
  return db.collection('ipl_players');
}

module.exports = dbConnect;
