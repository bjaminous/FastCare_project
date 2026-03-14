const express = require('express');
const router = express.Router();
const { start, stop } = require('../controllers/jeune.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/start', auth, start);
router.patch('/:id/stop', auth, stop);

module.exports = router;
