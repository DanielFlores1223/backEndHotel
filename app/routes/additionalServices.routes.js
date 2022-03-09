const express = require('express');
const router = express.Router();
const path = 'additionalServices';

const controller = require('../controllers/additionalServices.controller');

router.get(`/${path}`, controller.findAll);
router.get(`/${path}/:_id`, controller.findOneById);
router.post( `/${path}`,  controller.create);
router.put( `/${path}/:_id`,  controller.update);
router.delete( `/${path}/:_id`,  controller.deleteOne);

module.exports = router;