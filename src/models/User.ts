import { model, Schema } from 'mongoose'

import { User } from '../typings/user.typings'

const userSchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    password: { type: String, required: true },
    updated: { type: Date, default: Date.now },
    username: {
      index: true,
      lowercase: true,
      required: true,
      type: String,
      unique: true
    }
  },
  {
    usePushEach: true
  }
)

export default model<User>('User', userSchema)
