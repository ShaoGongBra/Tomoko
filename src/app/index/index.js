module.exports = {
  async index(ctx, next) {
    // throw { message: '请求失败' }
    ctx.type = 'json'
    ctx.body = { name: '请求返回' }
  }
}