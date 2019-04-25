import { model, Schema } from 'mongoose'

import { Category } from '../typings/category.typings'

const categorySchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    description: { type: String, required: true },
    name: { type: String, required: true, index: true, unique: true },
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
/* tslint:enable:object-literal-sort-keys */

export default model<Category>('Category', categorySchema)
