import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      image: { type: String, required: true },
      brand: { type: String, required: true },
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref:"Category", required: true },
      categoryName: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      isFeatured: {type: Boolean, default: false, required:false},
      countInStock: { type: Number, required: true },
      rating: { type: Number, required: true },
      numReviews: { type: Number, required: false },
    },
    {
      timestamps: true,
    }
  );

  productSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  productSchema.set("toJSON", {
    virtuals: true,
  });
  
  const Product = mongoose.model('Product', productSchema);
  export default Product;