const mysql = require('mysql')
const config = require(__rootdir + '/config/db')

module.exports = app => {
  var connection = mysql.createConnection(config)

  connection.connect()

  connection.query('select * from user where 1', function (error, results, fields) {
    if (error) throw error;
    console.log('返回值: ', results)
  })

  connection.end()
  app.context.db = {
    name: '数据库链接工具'
  }

}