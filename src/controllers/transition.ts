import express from 'express'

import { asyncForEach, removeDuplicateItems } from '../helpers'
import Transition from '../models/Transition'

import { updateTransitions } from './move'

const DUPLICATE_ERROR = 'Duplicate transition'

export const create = async (req: express.Request, res: express.Response) => {
  const { endingMove, multimedia, startingMove } = req.body
  const user = req.user.id

  if (await isDuplicateTransition(startingMove, endingMove)) {
    return res.status(422).send({ code: 'ERROR', data: DUPLICATE_ERROR })
  }

  const newTransition = new Transition({
    endingMove,
    multimedia,
    startingMove,
    user
  })

  newTransition
    .save()
    .then(async (transition) => {
      await updateTransitions(endingMove, await getTransitions(endingMove))
      await updateTransitions(startingMove, await getTransitions(startingMove))

      res.status(200).send({ code: 'SUCCESS', data: transition })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const list = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Transition.find({ user })
    .populate('endingMove multimedia startingMove user')
    .exec()
    .then((transitions) => {
      res.status(200).send({ code: 'SUCCESS', data: transitions })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const get = (req: express.Request, res: express.Response) => {
  const user = req.user.id

  Transition.findOne({ _id: req.params.id, user })
    .populate('endingMove multimedia startingMove user')
    .exec()
    .then((transition) => {
      res.status(200).send({ code: 'SUCCESS', data: transition })
    })
    .catch((err) => {
      res.status(500).send({ code: 'ERROR', data: err })
    })
}

export const update = (req: express.Request, res: express.Response) => {
  const { endingMove, multimedia, startingMove } = req.body
  const user = req.user.id

  const transitionMoves: string[] = []

  Transition.findOne({ _id: req.params.id, user })
    .populate('multimedia user') // don't populate moves as we need to get id
    .exec()
    .then(async (transition) => {
      if (
        await isDuplicateTransition(startingMove, endingMove, transition._id)
      ) {
        throw 422
      }

      // old transition moves
      transitionMoves.push(transition.endingMove)
      transitionMoves.push(transition.startingMove)
      // new transition moves
      transitionMoves.push(endingMove)
      transitionMoves.push(startingMove)

      transition.endingMove = endingMove
      transition.multimedia = multimedia
      transition.startingMove = startingMove
      transition.updated = new Date()

      return transition.save()
    })
    .then(async (transition) => {
      await asyncForEach(
        removeDuplicateItems(transitionMoves),
        async (move) => {
          await updateTransitions(move, await getTransitions(move))
        }
      )

      res.status(200).send({ code: 'SUCCESS', data: transition })
    })
    .catch((err) => {
      if (err === 422) {
        res.status(422).send({ code: 'ERROR', data: DUPLICATE_ERROR })
      } else {
        res.status(500).send({ code: 'ERROR', data: err })
      }
    })
}

export const getTransitions = async (moveId: string) => {
  const transitionsIn = (await Transition.find({
    endingMove: moveId
  }).exec()).map((transition) => transition.startingMove)
  const transitionsOut = (await Transition.find({
    startingMove: moveId
  }).exec()).map((transition) => transition.endingMove)

  return {
    transitionsIn,
    transitionsOut
  }
}

const isDuplicateTransition = async (
  startingMove: string,
  endingMove: string,
  currentTransitionId?: string
) => {
  const transitions = await Transition.find({ startingMove, endingMove }).exec()

  if (
    transitions[0] &&
    (!currentTransitionId ||
      transitions[0]._id.toString() !== currentTransitionId.toString())
  ) {
    return true
  }

  return false
}
