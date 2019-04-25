import { Document } from 'mongoose'

export interface Tag extends Document {
  archived?: boolean
  category: string
  color: string
  created: Date
  description: string
  name: string
  updated: Date
  user: string
}