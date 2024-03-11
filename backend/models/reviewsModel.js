import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ReviewsSchema.set("toJSON", {
  virtuals: true,
});

const Reviews = mongoose.model("Reviews", ReviewsSchema);
export default Reviews;
