const { Sequelize, DataTypes } = require('sequelize')
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
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false
  })
  // const UserToken = sequelize.define('userToken', {
  //   token_id: {
  //     type: Sequelize.INTEGER(10),
  //     primaryKey: true
  //   },
  //   username: Sequelize.STRING(255),
  //   password: Sequelize.STRING(255),
  //   phone: {
  //     type: Sequelize.STRING(15)
  //   },
  //   email: {
  //     type: Sequelize.STRING(255)
  //   },
  //   status: Sequelize.BOOLEAN
  // }, {
  //   timestamps: false
  // })
  app.context.db = {
    sequelize,
    User
  }
}