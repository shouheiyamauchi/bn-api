import { Document } from 'mongoose'

export interface Category extends Document {
  archived?: boolean
  created: Date
  description: string
  name: string
  updated: Date
  user: string
}
