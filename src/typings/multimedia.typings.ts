import { Document } from 'mongoose'

export interface Multimedia extends Document {
  archived?: boolean
  created: Date
  media: string
  name: string
  updated: Date
  user: string
  value: string
}
