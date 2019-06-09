import express from 'express'

import Tag from '../models/Tag'
import { Status } from '../utils/http'

const DUPLICATE_ERROR = 'Duplicate tag name'

export const create = async (req: express.Request, res: express.Response) => {
  const { category, description, name } = req.body
  const user = req.user.id

  if (await isDuplicateName(name, user)) {
    return res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
  }

  const newTag = new Tag({ category, description, name, user })

  newTag
    .save()
    .then((tag) => {
      res.status(200).send({ code: Status.Success, data: tag })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Tag.find({ user })
    .populate('category user')
    .exec()
    .then((tags) => {
      res.status(200).send({ code: Status.Success, data: tags })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Tag.findOne({ _id: req.params.id, user })
    .populate('category user')
    .exec()
    .then((tag) => {
      res.status(200).send({ code: Status.Success, data: tag })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { category, description, name } = req.body
  const user = req.user.id

  Tag.findOne({ _id: req.params.id, user })
    .populate('category user')
    .exec()
    .then(async (tag) => {
      if (await isDuplicateName(name, user, tag._id)) {
        throw 422
      }

      tag.category = category
      tag.description = description
      tag.name = name
      tag.updated = new Date()

      return tag.save()
    })
    .then((tag) => {
      res.status(200).send({ code: Status.Success, data: tag })
    })
    .catch((err) => {
      if (err === 422) {
        res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
      } else {
        res.status(500).send({ code: Status.Error, data: err })
      }
    })
}

const isDuplicateName = async (
  name: string,
  user: string,
  currentTagId?: string
) => {
  const tags = await Tag.find({ name, user }).exec()

  if (
    tags[0] &&
    (!currentTagId || tags[0]._id.toString() !== currentTagId.toString())
  ) {
    return true
  }

  return false
}
