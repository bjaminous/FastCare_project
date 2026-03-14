const express = require('express');
const router = express.Router();
const { add, getAll, update, stats } = require('../controllers/suivi.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getAll);
router.post('/', auth, add);
router.patch('/:id', auth, update);
router.get('/stats', auth, stats);

module.exports = router;
