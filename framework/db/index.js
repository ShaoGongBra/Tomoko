const Sequelize = require('sequelize')
const config = require(__rootdir + '/config/db')

module.exports = app => {
  const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
    define: {
      freezeTableName: true, // 强制表名称等于模型名称
    }
  })
  let authenticate = false
  app.use(async (ctx, next) => {
    try {
      if (!authenticate) {
        await sequelize.authenticate()
        authenticate = true
      }
      await next()
    } catch (error) {
      ctx.body = error
    }
  })

  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INET(10),
      primaryKey: true
    },
    username: Sequelize.STRING(255),
    password: Sequelize.STRING(255),
    status: Sequelize.BOOLEAN
  }, {
    timestamps: false
  })
  app.context.db = {
    sequelize,
    User
  }
}