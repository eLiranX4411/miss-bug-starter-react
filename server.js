import fs from 'fs'
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
import { utilService } from './services/util.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// SERVER HOMEPAGE - All Data (bugs) / LIST
app.get('/api/bug', (req, res) => {
  const filterBy = {
    title: req.query.title || '',
    severity: +req.query.severity || 0,
    pageIdx: +req.query.pageIdx || 0,
    labels: req.query.labels ? req.query.labels.split(',') : []
  }

  const sortBy = {
    title: req.query.title || '',
    severity: +req.query.severity || 0,
    createdAt: +req.query.createdAt || 0,
    sortDir: +req.query.sortDir || 0
  }

  bugService
    .query(filterBy, sortBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send('Problem Getting Bugs', err)
    })
})

// SERVER CRUD POST

app.post('/api/bug', (req, res) => {
  const bugToSave = {
    title: req.body.title || '',
    description: req.body.description || '',
    severity: +req.body.severity || 0,
    createdAt: +req.body.createdAt || 0,
    labels: req.body.labels || []
  }

  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot add bug', err)
      res.status(400).send('Cannot add bug', err)
    })
})

// SERVER CRUD PUT

app.put('/api/bug/:bugId', (req, res) => {
  const bugToSave = {
    _id: req.body._id || '',
    title: req.body.title || '',
    description: req.body.description || '',
    severity: +req.body.severity || 0,
    createdAt: +req.body.createdAt || 0,
    labels: req.body.labels || []
  }

  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot edit bug', err)
      res.status(400).send('Cannot edit bug', err)
    })
})

// SERVER CRUD BY ID / Details
app.get('/api/bug/:bugId', visitedBugs, (req, res) => {
  const { bugId } = req.params

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

// SERVER CRUD REMOVE / DELETE
app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params

  bugService
    .remove(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(400).send(err)
    })
})

// SERVER LOGS
app.get('/api/logs', (req, res) => {
  const path = process.cwd()
  res.sendFile(path + '/logs/backend.log')
})

// SERVER PORT LISTENER
const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

// COOKIES VISIT BUGS MIDDLEWARE FUNCTION
function visitedBugs(req, res, next) {
  const { bugId } = req.params

  let visitedBugs = req.cookies.visitedBugs || []

  if (!visitedBugs.includes(bugId)) {
    visitedBugs.push(bugId)
  }

  if (visitedBugs.length > 3) {
    loggerService.error(`User visit more then 3 bugs ${visitedBugs} `)
    return res.status(401).send('Wait for a bit...')
  }
  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
  console.log(`User visited the following bugs: [${visitedBugs}]`)

  next()
}

// ---------------------TrashCan---------------------

// app.get('/', (req, res) => res.send('<h1> Hello </h1>'))
// app.listen(3030, () => console.log('Server ready at port 3030'))

// app.get('/visit/:bugId', (req, res) => {
//   const bugId = req.params.bugId
//   let visitedBugs = req.cookies.visitedBugs || []

//   if (!visitedBugs.includes(bugId)) {
//     visitedBugs.push(bugId)
//   }

//   if (visitedBugs.length > 3) {
//     return res.status(401).send('Wait for a bit')
//   }
//   res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
//   console.log(`User visited the following bugs: [${visitedBugs}]`)

//   res.send(`You visited bug ${bugId}`)
// })
