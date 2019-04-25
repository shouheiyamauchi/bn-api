import { model, Schema } from 'mongoose'

import { Move } from '../typings/move.typings'

const moveSchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    description: { type: String, required: true },
    draft: { type: Boolean, required: true },
    name: { type: String, required: true, index: true, unique: true },
    tags: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Tag',
      index: true
    },
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

export default model<Move>('Move', moveSchema)
