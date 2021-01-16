const Koa = require('koa')
const compose = require('koa-compose')

const fs = require('fs')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')

const app = new Koa()

const rootDir = __dirname + '/src'
const appDir = rootDir + '/app/'
const dirs = fs.readdirSync(appDir)
const files = []
for (let i = 0, l = dirs.length; i < l; i++) {
  if (fs.statSync(appDir + dirs[i]).isDirectory()) {
    files.push(...fs.readdirSync(appDir + dirs[i] + '/').filter(f => f.endsWith('.js')).map(item => dirs[i] + '/' + item))
  }
}

for (const f of files) {
  const mapping = require(appDir + f)
  for (var url in mapping) {
    const path = `/${f.replace('.js', '')}/${url}`
    router.get(path, mapping[url])
    router.post(path, mapping[url])
  }
  if (f === 'index.js' && mapping.index) {
    router.get('/', mapping.index)
    router.post('/', mapping.index)
  }
}
console.log(files)

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

app.use(compose([logger(), bodyParser(), router.routes()]))

app.listen(3000)
console.log('http://127.0.0.1:3000')