import express from 'express'

import Category from '../models/Category'
import Move from '../models/Move'
import Tag from '../models/Tag'
import { NestedCategory } from '../typings/category.typings'
import { Status } from '../utils/http'

const NO_MATCH_ERROR = 'Cannot find category'
const DUPLICATE_ERROR = 'Duplicate category name'

export const create = async (req: express.Request, res: express.Response) => {
  const { color, name } = req.body
  const user = req.user.id

  if (await isDuplicateName(name, user)) {
    return res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
  }

  const newCategory = new Category({ color, name, user })

  newCategory
    .save()
    .then((category) => {
      res.status(200).send({ code: Status.Success, data: category })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Category.find({ user })
    .populate('user')
    .exec()
    .then(async (categories) => {
      const tags = await Tag.find({ user }).exec()

      const data = categories.map((category) => ({
        ...category.toObject(),
        tags: tags.filter(
          (tag) => String(tag.category) === String(category._id)
        )
      }))

      res.status(200).send({ code: Status.Success, data })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Category.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then((category) => {
      if (category) {
        res.status(200).send({ code: Status.Success, data: category })
      } else {
        res.status(404).send({ code: Status.Error, data: NO_MATCH_ERROR })
      }
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { color, name } = req.body
  const user = req.user.id

  Category.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then(async (category) => {
      if (!category) {
        throw 404
      }

      if (await isDuplicateName(name, user, category._id)) {
        throw 422
      }

      category.color = color
      category.name = name
      category.updated = new Date()

      return category.save()
    })
    .then((category) => {
      res.status(200).send({ code: Status.Success, data: category })
    })
    .catch((err) => {
      switch (err) {
        case 404:
          res.status(404).send({ code: Status.Error, data: NO_MATCH_ERROR })
          break
        case 422:
          res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
          break
        default:
          res.status(500).send({ code: Status.Error, data: err })
      }
    })
}

export const nested = (req: express.Request, res: express.Response) => {
  const { categories } = req.body
  const user = req.user.id

  nestedCategory(categories, [], [], user)
    .then((category) => {
      res.status(200).send(category)
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

const nestedCategory = async (
  categoryIds: string[],
  includedTagIds: string[],
  excludedTagIds: string[],
  user: string
): Promise<NestedCategory> => {
  interface TagsQuery {
    $all?: string[]
    $nin?: string[]
  }

  const [currentCategoryId, ...remainingCategoryIds] = categoryIds

  const category = await Category.findOne({
    _id: currentCategoryId,
    user
  }).exec()

  const tags = await Tag.find({ category: currentCategoryId, user }).exec()

  const categoryTags = []

  for (const tag of tags) {
    const updatedIncludedTagIds = [...includedTagIds, tag._id]

    const tagsQuery: TagsQuery = {}
    if (updatedIncludedTagIds.length) {
      tagsQuery.$all = updatedIncludedTagIds
    }
    if (excludedTagIds.length) {
      tagsQuery.$nin = excludedTagIds
    }
    categoryTags.push({
      childCategory:
        remainingCategoryIds.length > 0
          ? await nestedCategory(
              remainingCategoryIds,
              updatedIncludedTagIds,
              excludedTagIds,
              user
            )
          : undefined,
      moves:
        remainingCategoryIds.length > 0
          ? undefined
          : await Move.find({ tags: tagsQuery, user }),
      tagId: tag._id,
      tagName: tag.name
    })
  }

  // 'None' category which excludes all tags above
  const updatedExcludedTagIds = [
    ...excludedTagIds,
    ...tags.map((tag) => tag._id)
  ]
  const noneTagsQuery: TagsQuery = {}
  if (includedTagIds.length) {
    noneTagsQuery.$all = includedTagIds
  }
  if (updatedExcludedTagIds.length) {
    noneTagsQuery.$nin = updatedExcludedTagIds
  }
  categoryTags.push({
    childCategory:
      remainingCategoryIds.length > 0
        ? await nestedCategory(
            remainingCategoryIds,
            includedTagIds,
            updatedExcludedTagIds,
            user
          )
        : undefined,
    moves:
      remainingCategoryIds.length > 0
        ? undefined
        : await Move.find({ tags: noneTagsQuery, user }),
    tagId: 'none',
    tagName: 'None'
  })

  return {
    categoryId: category._id,
    categoryName: category.name,
    tags: categoryTags
  }
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
