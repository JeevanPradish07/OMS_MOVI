const express = require('express');
const router = express.Router();
const { getMyPayments, getAllPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', getMyPayments);
router.get('/', authorize('admin', 'pmo', 'hr'), getAllPayments);
router.post('/', authorize('admin', 'pmo', 'hr'), createPayment);
router.patch('/:id', authorize('admin', 'pmo', 'hr'), updatePayment);
router.delete('/:id', authorize('admin', 'pmo', 'hr'), deletePayment);

module.exports = router;
