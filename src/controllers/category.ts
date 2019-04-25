import express from 'express'

import Category from '../models/Category'

export const create = (req: express.Request, res: express.Response) => {
  const { description, name } = req.body
  const user = req.user.id

  const newCategory = new Category({ description, name, user })

  newCategory
    .save()
    .then((category) => {
      res.status(200).send({ code: 'SUCCESS', data: category })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const list = (_: express.Request, res: express.Response) => {
  Category.find()
    .populate('user')
    .exec()
    .then((categories) => {
      res.status(200).send({ code: 'SUCCESS', data: categories })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  Category.findOne({ _id: req.params.id })
    .populate('user')
    .exec()
    .then((category) => {
      res.status(200).send({ code: 'SUCCESS', data: category })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { description, name } = req.body

  Category.findOne({ _id: req.params.id })
    .populate('user')
    .exec()
    .then((category) => {
      if (description) {
        category.description = description
      }
      if (name) {
        category.name = name
      }
      category.updated = new Date()

      return category.save()
    })
    .then((category) => {
      res.status(200).send({ code: 'SUCCESS', data: category })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}
