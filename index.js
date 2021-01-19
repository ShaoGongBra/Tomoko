// 项目根目录
global.__rootdir = __dirname
// app目录
global.__appdir = __dirname + '/app'

/**
 * 启动app
 */
require('./framework/app')(3000)
