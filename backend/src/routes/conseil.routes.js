// routes/conseil.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/conseil.controller");

router.post("/", auth, ctrl.create);
router.get("/", auth, ctrl.getByCategory);

module.exports = router;
