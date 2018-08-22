const koa = require('koa')
const sequelize = require('sequelize')

global.sq = new sequelize({
	user: 'feed4rz',
	database: 'feed4rz',
  dialect: 'postgres',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
})

global.sq.authenticate()
global.sq.sync({ force: true })

const app = new koa()

app.use(require('./controllers').middleware())

app.listen(3000)