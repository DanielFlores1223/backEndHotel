const express = require('express');
const router = express.Router();
const path = 'user';

const controller = require('../controllers/users.controller');

router.get(`/${path}s`, controller.prueba);
router.post(`/${path}`, controller.create);
router.post(`/${path}/login`, controller.login);

module.exports = router;