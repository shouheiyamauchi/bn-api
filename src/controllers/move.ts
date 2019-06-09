import express from 'express'

import { removeDuplicateItems } from '../helpers'
import Move from '../models/Move'
import { Status } from '../utils/http'

const DUPLICATE_ERROR = 'Duplicate move name'

export const create = async (req: express.Request, res: express.Response) => {
  const { description, draft, multimedia, name, tags } = req.body
  const user = req.user.id

  if (await isDuplicateName(name, user)) {
    return res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
  }

  const newMove = new Move({
    description,
    draft,
    multimedia,
    name,
    tags: removeDuplicateItems(tags),
    user
  })

  newMove
    .save()
    .then((move) => {
      res.status(200).send({ code: Status.Success, data: move })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Move.find({ user })
    .populate('multimedia tags user')
    .exec()
    .then((moves) => {
      res.status(200).send({ code: Status.Success, data: moves })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Move.findOne({ _id: req.params.id, user })
    .populate('multimedia tags transitionsIn transitionsOut user')
    .exec()
    .then(async (move) => {
      res.status(200).send({ code: Status.Success, data: move })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { description, draft, multimedia, name, tags } = req.body
  const user = req.user.id

  Move.findOne({ _id: req.params.id, user })
    .populate('multimedia tags transitionsIn transitionsOut user')
    .exec()
    .then(async (move) => {
      if (await isDuplicateName(name, user, move._id)) {
        throw 422
      }

      move.description = description
      move.draft = draft
      move.multimedia = multimedia
      move.name = name
      move.tags = tags
      move.updated = new Date()

      return move.save()
    })
    .then((move) => {
      res.status(200).send({ code: Status.Success, data: move })
    })
    .catch((err) => {
      if (err === 422) {
        res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
      } else {
        res.status(500).send({ code: Status.Error, data: err })
      }
    })
}

export const updateTransitions = (
  moveId: string,
  {
    transitionsIn,
    transitionsOut
  }: { transitionsIn: string[]; transitionsOut: string[] }
) => {
  Move.findOne({ _id: moveId })
    .exec()
    .then((move) => {
      move.transitionsIn = transitionsIn
      move.transitionsOut = transitionsOut
      move.updated = new Date()

      return move.save()
    })
}

const isDuplicateName = async (
  name: string,
  user: string,
  currentMoveId?: string
) => {
  const moves = await Move.find({ name, user }).exec()

  if (
    moves[0] &&
    (!currentMoveId || moves[0]._id.toString() !== currentMoveId.toString())
  ) {
    return true
  }

  return false
}
