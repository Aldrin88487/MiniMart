const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart items for logged in user
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    // Find all cart items for user and populate product details
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate('productId', 'name price category description image');
    
    // Filter out items where the product might have been deleted in the meantime
    const validItems = cartItems.filter(item => item.productId !== null);
    
    res.status(200).json(validItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, action } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find if user already has this product in cart
    let cartItem = await Cart.findOne({ userId: req.user.id, productId });

    const qtyChange = quantity !== undefined ? Number(quantity) : 1;

    if (cartItem) {
      // If item exists, update its quantity
      if (action === 'set') {
        cartItem.quantity = qtyChange;
      } else if (action === 'decrement') {
        cartItem.quantity = Math.max(1, cartItem.quantity - 1);
      } else {
        // Default to increment or simple add
        cartItem.quantity += qtyChange;
      }
      
      await cartItem.save();
    } else {
      // If item does not exist, create new cart record
      cartItem = new Cart({
        userId: req.user.id,
        productId,
        quantity: Math.max(1, qtyChange)
      });
      await cartItem.save();
    }

    // Return the updated cart items list
    const updatedCart = await Cart.find({ userId: req.user.id })
      .populate('productId', 'name price category description image');

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if ID is a cart item ID or product ID
    let cartItem = await Cart.findOne({ userId: req.user.id, _id: id });
    if (!cartItem) {
      cartItem = await Cart.findOne({ userId: req.user.id, productId: id });
    }

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await Cart.findByIdAndDelete(cartItem._id);

    // Return the updated cart list
    const updatedCart = await Cart.find({ userId: req.user.id })
      .populate('productId', 'name price category description image');

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart for user
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    // Delete all cart items for the logged in user
    await Cart.deleteMany({ userId: req.user.id });

    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
