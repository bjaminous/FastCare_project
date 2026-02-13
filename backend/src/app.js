const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FastCare API running (MySQL)");
});

app.use("/journals", require("./routes/journal.routes"));
app.use("/notifications", require("./routes/notification.routes"));
app.use("/conseils", require("./routes/conseil.routes"));

module.exports = app;
