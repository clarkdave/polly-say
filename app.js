'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const synthesize = require('./lib/synthesize')
const say = require('./lib/say')

const app = express()

const PORT = process.env.PORT || 8080
const SECRET_TOKEN = process.env.SECRET_TOKEN

if (!SECRET_TOKEN) throw new Error('process.env.SECRET_TOKEN is required')

app.use(morgan('dev'))
app.use(bodyParser.json())

let isBusy = false

app.post('/webhooks/say', (req, res, next) => {
  if (req.header('x-secret-token') !== SECRET_TOKEN) {
    return res.sendStatus(401)
  }

  if (isBusy) {
    return res.sendStatus(429)
  }

  const { text, voice } = req.body
  isBusy = true

  synthesize(text, voice).
    then(data => {
      console.log(`Synthesized ${data.requestCharacters} characters`)
      return say(data.audioStream)
    }).
    then(() => {
      isBusy = false
      return res.sendStatus(200)
    }).
    catch(err => {
      isBusy = false
      console.error(err)
      return res.sendStatus(500)
    })
})

app.listen(PORT, err => {
  if (err) {
    return console.error(err)
  }

  return console.log(`Listening on :${PORT}`)
})
