import express from 'express'

import Multimedia from '../models/Multimedia'
import { Status } from '../utils/http'

const DUPLICATE_ERROR = 'Duplicate multimedia name'

export const create = async (req: express.Request, res: express.Response) => {
  const { media, name, value } = req.body
  const user = req.user.id

  if (await isDuplicateName(name, user)) {
    return res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
  }

  const newMultimedia = new Multimedia({ media, name, user, value })

  newMultimedia
    .save()
    .then((multimedia) => {
      res.status(200).send({ code: Status.Success, data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Multimedia.find({ user })
    .populate('user')
    .exec()
    .then((multimedia) => {
      res.status(200).send({ code: Status.Success, data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Multimedia.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then((multimedia) => {
      res.status(200).send({ code: Status.Success, data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: Status.Error, data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { media, name, value } = req.body
  const user = req.user.id

  Multimedia.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then(async (multimedia) => {
      if (await isDuplicateName(name, user, multimedia._id)) {
        throw 422
      }

      multimedia.media = media
      multimedia.name = name
      multimedia.value = value
      multimedia.updated = new Date()

      return multimedia.save()
    })
    .then((multimedia) => {
      res.status(200).send({ code: Status.Success, data: multimedia })
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
  currentMultimediaId?: string
) => {
  const multimedia = await Multimedia.find({ name, user }).exec()

  if (
    multimedia[0] &&
    (!currentMultimediaId ||
      multimedia[0]._id.toString() !== currentMultimediaId.toString())
  ) {
    return true
  }

  return false
}
