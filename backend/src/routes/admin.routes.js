const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/admin.controller");

// Toutes les routes admin nécessitent auth + rôle admin
router.use(auth, requireAdmin);

router.get("/users",                    ctrl.getUsers);
router.delete("/users/:id",             ctrl.deleteUser);
router.put("/users/:id/ban",            ctrl.toggleBan);
router.get("/stats",                    ctrl.getStats);
router.get("/conseils",                 ctrl.getConseils);
router.post("/conseils",                ctrl.createConseil);
router.put("/conseils/:id",             ctrl.updateConseil);
router.delete("/conseils/:id",          ctrl.deleteConseil);
router.post("/notifications/broadcast", ctrl.broadcastNotif);

module.exports = router;
