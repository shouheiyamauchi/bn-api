import { model, Schema } from 'mongoose'

import { Move } from '../typings/move.typings'

const moveSchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    description: { type: String, required: true },
    draft: { type: Boolean, required: true },
    multimedia: [
      {
        ref: 'Multimedia',
        required: true,
        type: Schema.Types.ObjectId
      }
    ],
    name: { type: String, required: true, index: true },
    tags: [
      {
        index: true,
        ref: 'Tag',
        required: true,
        type: Schema.Types.ObjectId
      }
    ],
    transitionsIn: [
      {
        index: true,
        ref: 'Move',
        required: true,
        type: Schema.Types.ObjectId
      }
    ],
    transitionsOut: [
      {
        index: true,
        ref: 'Move',
        required: true,
        type: Schema.Types.ObjectId
      }
    ],
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

export default model<Move>('Move', moveSchema)
