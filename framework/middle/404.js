module.exports = () => {
  return async (ctx, next) => {
    await next()
    if (ctx.response.status === 404) {
      ctx.body = '404'
    }
  }
}