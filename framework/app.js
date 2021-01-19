const Koa = require('koa')
const compose = require('koa-compose')
const bodyParser = require('koa-bodyparser')

const db = require('./db')
const router = require('./router')

module.exports = (port = 3000) => {
  const app = new Koa()
  db(app)
  app.use(compose([
    require('./middle/error')(),
    require('./middle/logger')(),
    require('./middle/404')(),
    bodyParser(),
    router().routes()
  ]))

  app.listen(port)
  console.log('http://127.0.0.1:' + port)
}

