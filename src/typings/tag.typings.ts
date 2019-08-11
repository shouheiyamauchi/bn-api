import { Document } from 'mongoose'

export interface Tag extends Document {
  archived?: boolean
  category: string
  created: Date
  name: string
  updated: Date
  user: string
}
