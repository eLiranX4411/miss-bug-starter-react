import express from 'express'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'

const app = express()

// app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => res.send('<h1> Hello </h1>'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error(err)
      res.status(500).send(err)
    })
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err)
      res.status(500).send(err)
    })
})

app.get('/api/bug/:bugId/remove', (req, res) => {})
app.get('/api/bug/save', (req, res) => {})
