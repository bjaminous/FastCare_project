require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

sequelize.sync({ alter: true })
  .then(() => console.log("Base de données connectée"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur lancé sur le port ${PORT}`)
);
