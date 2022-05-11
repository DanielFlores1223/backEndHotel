const express = require('express');
const router = express.Router();
const path = 'user';

const controller = require('../controllers/users.controller');

//router.get(`/${path}s`, controller.prueba);
router.post(`/${path}`, controller.create);
router.post(`/${path}/login`, controller.login);
router.post(`/${path}/searchFilterOr`, controller.searchFilterOr);
router.post(`/${path}/searchFilter`, controller.searchFilter);
router.put(`/${path}/:_id`, controller.updateUser);
router.delete(`/${path}/:_id`, controller.deleteOne);

// CUSTOMER ROUTES
router.put(`/${path}/customer/:_id`, controller.updateCustomer);
router.post(`/${path}/customer`, controller.createCustomer);

// RECEPTIONIST ROUTES
router.put(`/${path}/:_id/receptionist`, controller.updateReceptionist);

module.exports = router;