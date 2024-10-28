import express from 'express'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => res.send('<h1> Hey </h1>'))
app.listen(3030, () => console.log('Server ready at port 3030'))
