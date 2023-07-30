import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

const { port, mongoDbUri } = config;

(async () => {
  try {
    await mongoose.connect(mongoDbUri);
    console.log("Database connected");

    app.on("error", (error) => {
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    throw error;
  }
})();
