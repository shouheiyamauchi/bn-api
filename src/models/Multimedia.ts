import { model, Schema } from 'mongoose'

import { Multimedia } from '../typings/multimedia.typings'

const multimediaSchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    media: { enum: ['IMAGE', 'VIDEO'], type: String },
    name: { type: String, required: true, index: true },
    updated: { type: Date, default: Date.now },
    user: {
      index: true,
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId
    },
    value: { type: String, required: true }
  },
  {
    usePushEach: true
  }
)

export default model<Multimedia>('Multimedia', multimediaSchema)
