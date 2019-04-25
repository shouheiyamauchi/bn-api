import { Document } from 'mongoose'

export interface User extends Document {
  archived?: boolean
  created: Date
  password: string
  updated: Date
  username: string
}
