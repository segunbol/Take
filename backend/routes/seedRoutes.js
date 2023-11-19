import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  try {
    // await Product.remove({});
    // const createdProducts = await Product.insertMany(data.products);
    // await User.remove({});
    // const createdUsers = await User.insertMany(data.users);
    // await Category.remove({});
    // const createdCategories = await Category.insertMany(data.category);
    res.send({ createdProducts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
export default seedRouter;
