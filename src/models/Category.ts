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
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    }
  },
  {
    usePushEach: true
  }
)
/* tslint:enable:object-literal-sort-keys */

export default model<Category>('Category', categorySchema)
