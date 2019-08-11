import { model, Schema } from 'mongoose'

import { Tag } from '../typings/tag.typings'

const tagSchema = new Schema(
  {
    archived: { type: Boolean, default: false },
    category: {
      index: true,
      ref: 'Category',
      required: true,
      type: Schema.Types.ObjectId
    },
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

export default model<Tag>('Tag', tagSchema)
