const Koa = require('koa')
const compose = require('koa-compose')

const fs = require('fs')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')

module.exports = (port = 3000) => {
  const app = new Koa()
  const appDir = __appdir + '/'
  const dirs = fs.readdirSync(appDir)
  const files = []
  for (let i = 0, l = dirs.length; i < l; i++) {
    const controlDir = appDir + dirs[i] + '/control/'
    if (fs.statSync(controlDir).isDirectory()) {
      files.push(...fs.readdirSync(controlDir).filter(f => f.endsWith('.js')).map(item => dirs[i] + '/control/' + item))
    }
  }

  for (const f of files) {
    const file = require(appDir + f)
    const instance = new file()
    const mapping = Object.getOwnPropertyNames(instance.__proto__)
    for (const url of mapping) {
      if (url === 'constructor') {
        continue
      }
      const path = `/${f.replace('/control', '').replace('.js', '')}/${url}`
      router.get(path, instance[url])
      router.post(path, instance[url])
    }
    if (f === 'index/control/index.js' && instance.index) {
      router.get('/', instance.index)
      router.post('/', instance.index)
    }
  }

  // 日志函数
  function logger(format = ':method :time :url') {
    return async (ctx, next) => {
      const startTime = Date.now()
      await next()
      const endTime = Date.now()
      const str = format
        .replace(':method', ctx.method)
        .replace(':time', endTime - startTime + 'ms')
        .replace(':url', ctx.url)
      console.log(str)
    }
  }

  // 错误处理
  function error() {
    return async (ctx, next) => {
      try {
        await next()
      } catch (error) {
        ctx.body = '请求错误'
        console.log(error)
      }
    }
  }

  app.use(compose([error(), logger(), bodyParser(), router.routes()]))

  app.listen(port)
  console.log('http://127.0.0.1:' + port)
}

