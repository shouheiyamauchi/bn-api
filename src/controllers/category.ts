import express from 'express'

import Category from '../models/Category'

const DUPLICATE_ERROR = 'Duplicate category name'

export const create = async (req: express.Request, res: express.Response) => {
  const { description, name } = req.body
  const user = req.user.id

  if (await isDuplicateName(name, user)) {
    return res.status(422).send({ code: 'ERROR', data: DUPLICATE_ERROR })
  }

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
  const user = req.user.id

  Category.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then(async (category) => {
      if (await isDuplicateName(name, user, category._id)) {
        throw 422
      }

      category.description = description
      category.name = name
      category.updated = new Date()

      return category.save()
    })
    .then((category) => {
      res.status(200).send({ code: 'SUCCESS', data: category })
    })
    .catch((err) => {
      if (err === 422) {
        res.status(422).send({ code: 'ERROR', data: DUPLICATE_ERROR })
      } else {
        res.status(500).send({ code: 'ERROR', data: err })
      }
    })
}

const isDuplicateName = async (
  name: string,
  user: string,
  currentCategoryId?: string
) => {
  const categories = await Category.find({ name, user }).exec()

  if (
    categories[0] &&
    (!currentCategoryId ||
      categories[0]._id.toString() !== currentCategoryId.toString())
  ) {
    return true
  }

  return false
}
