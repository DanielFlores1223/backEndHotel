const express = require('express');
const router = express.Router();
const path = 'room';

const controller = require('../controllers/rooms.controller');

router.get( `/${path}s`, controller.findAll );
router.get( `/${path}/:_id`, controller.findById );
router.post( `/${path}/available/reservation`, controller.findAvailabeByDates );
router.post( `/${path}`, controller.create );
router.put( `/${path}/:_id`, controller.update );
router.delete( `/${path}/:_id`, controller.deleteOne );

module.exports = router;