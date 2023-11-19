import OrderItem from "../models/cartItems.js";
import Order from '../models/orderModel.js';

// @desc    Create a new order item
// @route   POST /api/orderitems
// @access  Public
export const createCartItem = async (req, res) => {
  try {
    console.log(req.body);
    const {
      userId,
      quantity,
      id,
      name,
      slug,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      dateCreated,
    } = req.body;
    // const id = req.body.id;
    console.log(userId);
    console.log(id);
    const orderItem = new OrderItem({
      quantity,
      userId,
      id,
      name,
      slug,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      dateCreated,
    });
    const createdOrderItem = await orderItem.save();

    res.status(201).json(createdOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update an order item
// @route   PUT /api/orderitems/:id
// @access  Public
export const updateCartItem = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body.id);
    const userId = req.params.id;
    const id = req.body.id;
    const { quantity } = req.body;

    // Find the order item with the given userId and productId
    const orderItem = await OrderItem.findOne({ userId, id: id });
    if (orderItem) {
      orderItem.quantity = quantity;
      const updatedCartItem = await orderItem.save();

      res.json(updatedCartItem);
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all order items
// @route   GET /api/orderitems
// @access  Public
export const getAllCartItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single order item by ID
// @route   GET /api/cartItems/:id
// @access  Public
export const getUserCartItems = async (req, res) => {
  try {
    console.log(req.params);
    const userId = req.params.id;
    const cartItems = await OrderItem.find({ userId });
    if (cartItems) {
      // console.log(cartItems);
      res.json(cartItems);
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.params.userId;
    const id = req.params.id;
    console.log(`${userId} and ${id}`);
    console.log(`${JSON.stringify(req.params)}`);
    // Find the order item with the given userId and productId
    const cartItem = await OrderItem.findOne({ userId, id: id });

    if (cartItem) {
      await OrderItem.deleteOne({ userId, id: id });
      console.log("Cart item removed successfully");
      res.json({ message: "Cart item removed successfully" });
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItem = await OrderItem.find({ userId });

    if (cartItem) {
      await OrderItem.deleteMany({ userId });
      console.log("Cart item removed successfully");
      res.json({ message: "Cart item removed successfully" });
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteCartItemsAndCreateOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(req.params)
    console.log(req.body)
    const cartItems = await OrderItem.find({ userId });

    if (cartItems.length > 0) {
      // Create order items from cart items
      const orderItems = cartItems.map((cartItem) => ({
        quantity: cartItem.quantity,
        product: cartItem.product,
      }));
 
      // Delete cart items
      await OrderItem.deleteMany({ userId });

      // Calculate total price for the order
      const totalPrices = cartItems.map(
        (cartItem) => cartItem.product.price * cartItem.quantity
      );
      const totalPrice = totalPrices.reduce((sum, price) => sum + price, 0);

      // Create the order
      const order = new Order({
        orderItems,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice,
        user: userId, // Assuming the user is linked to the userId
      });

      const createdOrder = await order.save();

      if (!createdOrder) {
        return res.status(400).send("The order cannot be created!");
      }

      res.send(createdOrder);
    } else {
      res.status(404).json({ error: "Cart items not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
