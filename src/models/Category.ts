import { model, Schema } from 'mongoose'

import { Category } from '../typings/category.typings'

const categorySchema = new Schema(
  {
    archived: { type: Boolean, default: false },
    color: { type: String, required: true },
    created: { type: Date, default: Date.now },
    name: { type: String, required: true, index: true },
    updated: { type: Date, default: Date.now },
    user: {
      index: true,
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId
    }
  },
  {
    usePushEach: true
  }
)

export default model<Category>('Category', categorySchema)
