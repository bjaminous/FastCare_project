// routes/notification.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/notification.controller");

router.post("/", auth, ctrl.create);
router.get("/history", auth, ctrl.getHistory);
router.get("/unread", auth, ctrl.getUnread);
router.post("/mark-all-read", auth, ctrl.markAllRead);
router.post("/:id/read", auth, ctrl.markAsRead);

module.exports = router;
