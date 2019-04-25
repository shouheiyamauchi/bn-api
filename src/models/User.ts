import { model, Schema } from 'mongoose'

import { User } from '../typings/user.typings'

const userSchema = new Schema(
  {
    archived: { type: Boolean },
    created: { type: Date, default: Date.now },
    password: { type: String, required: true },
    updated: { type: Date, default: Date.now },
    username: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      unique: true
    }
  },
  {
    usePushEach: true
  }
)

export default model<User>('User', userSchema)
