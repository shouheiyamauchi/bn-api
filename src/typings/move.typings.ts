import { Document } from 'mongoose'

export interface Move extends Document {
  archived?: boolean
  created: Date
  draft: boolean
  description: string
  multimedia: string[]
  name: string
  tags: string[]
  transitionsIn: string[]
  transitionsOut: string[]
  updated: Date
  user: string
}
