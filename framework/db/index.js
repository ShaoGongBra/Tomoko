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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: 'user'
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      unique: 'user'
    },
    email: {
      type: DataTypes.STRING,
      unique: 'user'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    
  })
  const UserToken = sequelize.define('userToken', {
    id: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      unique: 'token'
    },
    token: {
      type: DataTypes.STRING,
      unique: 'token'
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'web',
      comment: '设备类型 web:网页 app:App mini:小程序',
      unique: 'type'
    },
    mark: {
      type: DataTypes.STRING(1000),
      comment: '设备标识 浏览器ua或者设备标识'
    },
    date: {
      type: DataTypes.DATE
    }
  }, {
    
  })
  User.hasMany(UserToken)
  UserToken.belongsTo(User)

  app.context.db = {
    sequelize,
    User,
    UserToken
  }
}