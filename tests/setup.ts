import sequelize from "../src/config/database";
import "../src/models/User";
import "../src/models/Task";

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
});
