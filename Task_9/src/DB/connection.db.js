import mongoose from "mongoose";
import { DB_URI, port } from "../config/config.js";

async function testDBconnection(app) {
  try {
    await mongoose.connect(DB_URI);
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
