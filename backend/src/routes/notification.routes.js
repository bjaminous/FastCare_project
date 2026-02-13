// routes/notification.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/notification.controller");

router.post("/", auth, ctrl.create);
router.get("/history", auth, ctrl.getHistory);
router.post("/:id/read", auth, ctrl.markAsRead);

module.exports = router;
