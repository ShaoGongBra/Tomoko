module.exports = class Index {

  async index(ctx, next) {
    // throw { message: '请求失败' }
    console.log(ctx.db)
    // ctx.db.User.create({
    //   username: '王五',
    //   password: '3289743689sdfnj',
    //   status: true
    // })
    ctx.type = 'json'
    ctx.body = { name: '请求返回' }
  }

  async test(ctx, next) {
    ctx.body = { name: 'test' }
  }
}