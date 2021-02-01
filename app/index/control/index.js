module.exports = class Index {

  async index(ctx, next) {
    // throw { message: '请求失败' }
    // console.log(ctx.db)
    // ctx.db.User.create({
    //   username: '王五',
    //   password: '3289743689sdfnj',
    //   status: true
    // })
    await ctx.db.sequelize.sync({ alter: true })
    const list = await ctx.db.User.findAll({
      attributes: {
        exclude: ['status', 'password']
      },
      where: { status: true }
    })
    ctx.type = 'json'
    ctx.body = list
  }

  async test(ctx, next) {
    ctx.body = { name: 'test' }
  }
}