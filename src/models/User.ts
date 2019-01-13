import { model, Schema } from 'mongoose'

import { User } from '../typings/user'

/* tslint:disable:object-literal-sort-keys */
const userSchema = new Schema({
  username: { type: String, required: true, index: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
}, {
  usePushEach: true
})
/* tslint:enable:object-literal-sort-keys */

export default model<User>('User', userSchema)
