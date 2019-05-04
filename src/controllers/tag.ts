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

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Tag.find({ user })
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
  const user = req.user.id

  Tag.findOne({ _id: req.params.id, user })
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
      tag.category = category
      tag.color = color
      tag.description = description
      tag.name = name
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
