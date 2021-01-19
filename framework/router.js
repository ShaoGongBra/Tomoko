const fs = require('fs')
const router = require('koa-router')()
module.exports = () => {
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
  return router
}