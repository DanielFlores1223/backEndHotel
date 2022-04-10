const express = require('express');
const router = express.Router();
const path = 'typeRoom';

const controller = require('../controllers/typeRooms.controller');
const { uploadImage, uploadImages } = require('../middlewares/multer');

router.get(`/${path}s`, controller.findAll);
router.get(`/${path}/:_id`, controller.findOneById);
router.post( `/${path}`, uploadImages, controller.create);
router.post( `/${path}/picture/:_id`, uploadImages, controller.addPictures);
router.put( `/${path}/:_id`,  controller.update);
router.delete( `/${path}/:_id`,  controller.deleteOne);
router.delete( `/${path}/picture/:_id`,  controller.deleteOnePicture);

module.exports = router;