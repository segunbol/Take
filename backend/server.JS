import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import data from "./data.js";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import categoryRouter from "./routes/categoriesRoute.js";
import cors from "cors"
import cartItemsRoutes from "./routes/cartItems.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();


const __filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use(
  "/publicfiles/uploads",
  express.static(__dirname + "./publicfiles/uploads")
);

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

const api = process.env.API_URL;
app.use(`${api}/upload`, uploadRouter);
app.use(`${api}/seed`, seedRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/cartitems`, cartItemsRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
