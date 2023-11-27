const express = require('express');
const AccionesController = require('../controllers/AccionesController');

const router = express.Router();

router.get('/crearreserva', AccionesController.crearreserva);
router.post('/crearreserva', AccionesController.store);
router.route('/midata').get(AccionesController.midata).post(AccionesController.midata);
router.get('/misreservas', AccionesController.misreservas);
router.post('/misreservas/delete', AccionesController.destroy);

module.exports = router;