module.exports = class Index {

  async login(ctx, next) {
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