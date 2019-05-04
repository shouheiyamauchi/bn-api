import express from 'express'

import Multimedia from '../models/Multimedia'

export const create = (req: express.Request, res: express.Response) => {
  const { media, name, value } = req.body
  const user = req.user.id

  const newMultimedia = new Multimedia({ media, name, user, value })

  newMultimedia
    .save()
    .then((multimedia) => {
      res.status(200).send({ code: 'SUCCESS', data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Multimedia.findOne({ _id: req.params.id, user })
    .populate('user')
    .exec()
    .then((multimedia) => {
      res.status(200).send({ code: 'SUCCESS', data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { media, name, value } = req.body

  Multimedia.findOne({ _id: req.params.id })
    .populate('user')
    .exec()
    .then((multimedia) => {
      multimedia.media = media
      multimedia.name = name
      multimedia.value = value
      multimedia.updated = new Date()

      return multimedia.save()
    })
    .then((multimedia) => {
      res.status(200).send({ code: 'SUCCESS', data: multimedia })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}
