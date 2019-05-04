import { Document } from 'mongoose'

export interface Transition extends Document {
  archived?: boolean
  created: Date
  endingMove: string
  multimedia: string[]
  startingMove: string
  updated: Date
  user: string
}
