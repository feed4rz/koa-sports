const type = require('sequelize')

const Trainer = global.sq.define('trainer', {
  id: { autoIncrement: true, primaryKey: true, type: type.INTEGER },
  name: type.STRING
})

module.exports = Trainer