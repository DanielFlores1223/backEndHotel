const express = require('express');
const router = express.Router();
const path = 'anomalie';

const controller = require('../controllers/anomalies.controller');

router.get( `/${path}s`, controller.findAll );
router.get( `/${path}/:_id`, controller.findOneById );
router.post( `/${path}`, controller.create );
router.put( `/${path}/:_id`, controller.update );

module.exports = router;