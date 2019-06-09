import { Document } from 'mongoose'

import { Move } from './move.typings'

export interface Category extends Document {
  archived?: boolean
  color: string
  created: Date
  description: string
  name: string
  updated: Date
  user: string
}

export interface NestedCategory {
  categoryId: string
  categoryName: string
  tags: Array<{
    childCategory?: NestedCategory
    moves?: Move[]
    tagId: string
    tagName: string
  }>
}
