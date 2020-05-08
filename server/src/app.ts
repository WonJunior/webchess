import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { MONGO_CONNECTION_STRING } from './config'
import { Router } from './router/main.router'
import Authenticator from './middleware/Authenticator'

class App {
  public app: Application;
  public router: Router
  private authenticator = new Authenticator()

  constructor() {
    this.app = express()

    // app and db configuration
    this.setConfig()
    this.setMongoConfig()

    this.router = new Router(this.app)
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cors())
    this.app.use(this.authenticator.middleware.bind(this.authenticator))
  }

  private setMongoConfig() {
    mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

export default new App().app