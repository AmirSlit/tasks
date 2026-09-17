import { MongoClient } from "mongodb";
import { DB_NAME, DB_URL, port } from "../config/config.js";

const client = new MongoClient(DB_URL);

export async function testDBConnection(app) {
  try {
    await client.connect();
    console.log("DB Connected.");
    app.listen(port, () => {
      console.log(`server is running on port ${port}!`);
    });
  } catch (error) {
    console.log("DB Field Connection");
    console.log(error);
  }
}

export const DB = client.db(DB_NAME);
