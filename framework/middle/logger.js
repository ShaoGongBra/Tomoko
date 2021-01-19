module.exports = (format = ':method :url :time') => {
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