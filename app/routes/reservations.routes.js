const express = require('express');
const router = express.Router();
const path = 'reservation';

const controller = require('../controllers/reservations.controller');

router.post(`/${path}/:_id`, controller.createReservation);
router.post(`/${path}/extraExpense/:_id/:_idReservation`, controller.createExtraExpense);
router.post(`/${path}/changeRoom/:_id/:_idReservation`, controller.createChangeRoom);
router.post(`/${path}/survey/:_id/:_idReservation`, controller.responseSurvey);

module.exports = router;

