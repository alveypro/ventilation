import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tag: { type: String },
    tagType: { type: String },
    highlights: [String],
    description: String,
    suitableFor: [String],
    specs: Schema.Types.Mixed,
    image: String,
    advantages: [String],
    disadvantages: [String],
    reviews: [
      {
        id: Number,
        author: String,
        role: String,
        rating: Number,
        date: String,
        title: String,
        content: String,
        helpful: Number,
      },
    ],
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Product = model('Product', productSchema)
