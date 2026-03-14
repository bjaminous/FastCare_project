const express = require('express');
const router = express.Router();
const { create, getAll, update, delete: del } = require('../controllers/typeJeune.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.patch('/:id', auth, update);
router.delete('/:id', auth, del);

module.exports = router;
