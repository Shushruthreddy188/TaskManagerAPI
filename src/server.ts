import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/database";
import "./models/User";
import "./models/Task";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();      // test the connection
    console.log("Database connection established.");

    await sequelize.sync();              // create/update tables from models
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

start();
