import express from 'express';
import {
  deleteCartItem,
  updateCartItem,
  createCartItem,
  getAllCartItems,
  getUserCartItems,
  deleteCartItems,
  deleteCartItemsAndCreateOrder,
} from "../controller/cartItemsController.js";

const cartItemsRoutes = express.Router();

cartItemsRoutes.post('/', createCartItem);
cartItemsRoutes.get('/', getAllCartItems);
cartItemsRoutes.get('/:id', getUserCartItems);
cartItemsRoutes.put('/:id', updateCartItem);
cartItemsRoutes.delete('/:userId/:id', deleteCartItem);
cartItemsRoutes.delete('/:userId',deleteCartItems)
cartItemsRoutes.delete('/order/:userId',deleteCartItemsAndCreateOrder)
export default cartItemsRoutes;