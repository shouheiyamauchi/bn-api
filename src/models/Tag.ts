import { model, Schema } from 'mongoose'

import { Tag } from '../typings/tag.typings'

const tagSchema = new Schema(
  {
    archived: { type: Boolean },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
      index: true
    },
    color: { type: String, require: true },
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

export default model<Tag>('Tag', tagSchema)
