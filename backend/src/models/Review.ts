import { Schema, model } from 'mongoose'

const reviewSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: String,
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    tagType: { type: String },
    date: { type: Date, default: Date.now },
    author: String,
    productId: Schema.Types.ObjectId,
    images: [String],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Review = model('Review', reviewSchema)
