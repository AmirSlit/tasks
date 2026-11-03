import mongoose from "mongoose";
import { DB_URI, port } from "../config/config.js";
import { connectRedis } from "./redis.connection.js";

async function testDBconnection(app) {
  try {
    await mongoose.connect(DB_URI);
    await connectRedis();
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`server is running on port ${port}!`);
    });
  } catch (error) {
    console.log("DB Connection failed");
    console.log(error);
  }
}

export default testDBconnection;
