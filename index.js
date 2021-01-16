const Koa = require('koa')
const compose = require('koa-compose')
const app = new Koa()

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

// 耗时函数
function timeout(time = 100) {
  function asyncTimeout() {
    return new Promise(resolve => {
      setTimeout(() => resolve(), time)
    })
  }
  return async (ctx, next) => {
    await asyncTimeout()
    await next()
  }
}

async function body(ctx, next) {
  ctx.body = '请求成功'
}

app.use(compose([logger(), timeout(), body]))

app.listen(3000)
console.log('http://127.0.0.1:3000')