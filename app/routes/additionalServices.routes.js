const express = require('express');
const router = express.Router();
const path = 'additionalServices';

const controller = require('../controllers/additionalServices.controller');

router.post( `/${path}`,  controller.createAddtionalService);


module.exports = router;