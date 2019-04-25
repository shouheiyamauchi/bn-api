import { Document } from 'mongoose'

export interface Move extends Document {
  archived?: boolean
  created: Date
  draft: boolean
  description: string
  name: string
  tags: string[]
  updated: Date
  user: string
}
