import { model, Schema } from 'mongoose'

import { Transition } from '../typings/transition.typings'

const transitionSchema = new Schema(
  {
    archived: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    endingMove: {
      index: true,
      ref: 'Move',
      required: true,
      type: Schema.Types.ObjectId
    },
    multimedia: [
      {
        ref: 'Multimedia',
        required: true,
        type: Schema.Types.ObjectId
      }
    ],
    startingMove: {
      index: true,
      ref: 'Move',
      required: true,
      type: Schema.Types.ObjectId
    },
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

export default model<Transition>('Transition', transitionSchema)
