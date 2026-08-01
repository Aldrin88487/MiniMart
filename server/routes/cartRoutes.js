const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes are protected
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
