import express from 'express'

import Move from '../models/Move'

export const create = (req: express.Request, res: express.Response) => {
  const { description, draft, name, tags } = req.body
  const user = req.user.id

  const newMove = new Move({
    description,
    draft,
    name,
    tags: removeDuplicateTags(tags),
    user
  })

  newMove
    .save()
    .then((move) => {
      res.status(200).send({ code: 'SUCCESS', data: move })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Move.find({ user })
    .populate('tags user')
    .exec()
    .then((moves) => {
      res.status(200).send({ code: 'SUCCESS', data: moves })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Move.findOne({ _id: req.params.id, user })
    .populate('tags user')
    .exec()
    .then((move) => {
      res.status(200).send({ code: 'SUCCESS', data: move })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { description, draft, name, tags } = req.body

  Move.findOne({ _id: req.params.id })
    .populate('category user')
    .exec()
    .then((move) => {
      if (description) {
        move.description = description
      }
      if (draft) {
        move.draft = draft
      }
      if (name) {
        move.name = name
      }
      if (tags) {
        move.tags = tags
      }
      move.updated = new Date()

      return move.save()
    })
    .then((move) => {
      res.status(200).send({ code: 'SUCCESS', data: move })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

const removeDuplicateTags = (tags: string | string[]) => {
  const tagsKeys: { [key: string]: boolean } = {}
  if (Array.isArray(tags)) {
    tags.forEach((tag) => (tagsKeys[tag] = true))
  } else {
    tagsKeys[tags] = true
  }

  return Object.keys(tagsKeys)
}
