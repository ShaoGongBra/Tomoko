module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.log(error)
      ctx.body = '请求错误'
    }
  }
}