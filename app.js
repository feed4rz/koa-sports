const koa = require('koa')
const sequelize = require('sequelize')

global.sq = new sequelize({
	user: 'feed4rz',
	database: 'feed4rz',
  dialect: 'postgres',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  operatorsAliases: {
    $gt: sequelize.Op.gt,
    $lt: sequelize.Op.lt,
    $or: sequelize.Op.or,
    $and: sequelize.Op.and,
    $ne: sequelize.Op.ne,
    $like: sequelize.Op.like
  }
})

global.sq.authenticate()
global.sq.sync({ force: true })

const app = new koa()

app.use(require('./controllers').middleware())

app.listen(3000)