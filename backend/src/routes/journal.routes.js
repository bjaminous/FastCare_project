// routes/journal.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/journal.controller");

router.post("/", auth, ctrl.create);
router.get("/", auth, ctrl.getAll);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.delete);

module.exports = router;
