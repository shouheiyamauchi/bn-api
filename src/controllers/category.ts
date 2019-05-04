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

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Category.find({ user })
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
  const user = req.user.id

  Category.findOne({ _id: req.params.id, user })
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
      category.description = description
      category.name = name
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
