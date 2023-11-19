import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import { isAuth, isAdmin } from "../utils.js";
import multer from "multer";

const categoryRouter = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "publicfiles/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

categoryRouter.get("/", async (req, res) => {
  try {
    console.log(req.get("host"));
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

categoryRouter.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.send(category);
  } else {
    res.status(404).send({ message: "Category Not Found" });
  }
});

categoryRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newCategory = new Category({
      name: req.body.name,
      image: req.body.image,
    });
    const category = await newCategory.save();
    res.send({ message: "Category Created", category });
  })
);

categoryRouter.post("/m", uploadOptions.single("image"), async (req, res) => {
  // const category = await Category.findById(req.body.category);
  // if(!category) return res.status(400).send('Invalid Category')
  console.log(req);
  console.log(req.file);
  console.log(req.protocol);
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const newCategory = new Category({
      name: req.body.name,
      image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232",
    });
    const category = await newCategory.save();
    if (!category) {
      return res.status(500).send("The product cannot be created");
    }
    res.send(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

categoryRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (category) {
      category.name = req.body.name;
      category.image = req.body.image;

      await category.save();
      res.send({ message: "Category Updated" });
    } else {
      res.status(404).send({ message: "Category Not Found" });
    }
  })
);

categoryRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.send({ message: "Category Deleted" });
    } else {
      res.status(404).send({ message: "Category Not Found" });
    }
  })
);

const PAGE_SIZE = 3;

categoryRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const categories = await Category.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countCategories = await Category.countDocuments();
    res.send({
      categories,
      countCategories,
      page,
      pages: Math.ceil(countCategories / pageSize),
    });
  })
);

// categoryRouter.get(
//   '/search',
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const rating = query.rating || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const ratingFilter =
//       rating && rating !== 'all'
//         ? {
//             rating: {
//               $gte: Number(rating),
//             },
//           }
//         : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
//             // 1-50
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { createdAt: -1 }
//         : { _id: -1 };

//     const categories = await Category.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countCategories = await Category.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     });
//     res.send({
//       categoriess,
//       countCategories,
//       page,
//       pages: Math.ceil(countCategories / pageSize),
//     });
//   })
// );

export default categoryRouter;
