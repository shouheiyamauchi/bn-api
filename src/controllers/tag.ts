import express from 'express'

import Tag from '../models/Tag'

export const create = (req: express.Request, res: express.Response) => {
  const { category, color, description, name } = req.body
  const user = req.user.id

  const newTag = new Tag({ category, color, description, name, user })

  newTag
    .save()
    .then((tag) => {
      res.status(200).send({ code: 'SUCCESS', data: tag })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const list = (_: express.Request, res: express.Response) => {
  Tag.find()
    .populate('category user')
    .exec()
    .then((tags) => {
      res.status(200).send({ code: 'SUCCESS', data: tags })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  Tag.findOne({ _id: req.params.id })
    .populate('category user')
    .exec()
    .then((tag) => {
      res.status(200).send({ code: 'SUCCESS', data: tag })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { category, color, description, name } = req.body

  Tag.findOne({ _id: req.params.id })
    .populate('category user')
    .exec()
    .then((tag) => {
      if (category) {
        tag.category = category
      }
      if (color) {
        tag.color = color
      }
      if (description) {
        tag.description = description
      }
      if (name) {
        tag.name = name
      }
      tag.updated = new Date()

      return tag.save()
    })
    .then((tag) => {
      res.status(200).send({ code: 'SUCCESS', data: tag })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}
