import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    favorites: [Schema.Types.ObjectId],
    cart: [
      {
        productId: Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// 不返回密码字段
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export const User = model('User', userSchema)
